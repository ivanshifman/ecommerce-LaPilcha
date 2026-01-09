import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { Response, Request } from 'express';
import mongoose, { Error as MongooseError } from 'mongoose';

interface HttpExceptionResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

interface MongoDuplicateError extends Error {
  code: number;
  keyValue: Record<string, unknown>;
}

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Se produjo un error inesperado. Inténtelo de nuevo más tarde.';
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as HttpExceptionResponse | string;

      if (typeof res === 'string') {
        message = res;
      } else if (res?.message) {
        message = Array.isArray(res.message) ? res.message.join(', ') : res.message;
      }
    } else if (exception instanceof mongoose.Error.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Formato de dato incorrecto en el campo "${exception.path}"`;
    } else if (exception instanceof mongoose.Error.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      const errors = Object.values(exception.errors).map((e) => e.message);
      message = errors.join(', ');
    } else if (
      exception instanceof Error &&
      (exception as Partial<MongoDuplicateError>).code === 11000
    ) {
      status = HttpStatus.CONFLICT;
      const keyValue = (exception as MongoDuplicateError).keyValue ?? {};
      const fields = Object.keys(keyValue).join(', ');
      message = `Valor duplicado en el/los campo(s): ${fields}`;
    } else if (exception instanceof MongooseError.DocumentNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'El recurso solicitado no fue encontrado.';
    } else if (exception instanceof MongooseError.VersionError) {
      status = HttpStatus.CONFLICT;
      message = 'Conflicto de versión. El documento fue modificado por otra operación.';
    } else if (exception instanceof Error && exception.name === 'MongooseServerSelectionError') {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Error de conexión con la base de datos.';
    } else if (exception instanceof Error) {
      message = isProd ? 'Error de servidor.' : exception.message;
    }

    if (!isProd && exception instanceof Error) {
      this.logger.error(`❌ ${message}`, exception.stack);
    }

    const payload = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
      ...(!isProd && {
        error: exception instanceof Error ? exception.constructor.name : typeof exception,
        stack: exception instanceof Error ? exception.stack : undefined,
        path: request.url,
        method: request.method,
      }),
    };

    if (!response.headersSent) {
      httpAdapter.reply(response, payload, status);
    }
  }
}
