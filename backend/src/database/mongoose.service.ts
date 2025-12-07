import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection, ClientSession } from 'mongoose';

@Injectable()
export class MongooseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongooseService.name);
  private connection: Connection | null = null;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const env = this.config.get<string>('NODE_ENV') ?? process.env.NODE_ENV;
    const uri = this.config.get<string>('DATABASE_URI') ?? this.config.get<string>('DATABASE_URL');

    if (!uri) {
      this.logger.error('❌ MONGO_URI is missing in environment variables.');
      process.exit(1);
    }

    try {
      await mongoose.connect(uri, {
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.connection = mongoose.connection;

      this.setupConnectionEvents();

      if (env !== 'production') {
        mongoose.set('debug', true);
      }

      this.logger.log('✅ MongoDB connection established successfully.');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`❌ Error connecting to MongoDB: ${error.message}`);
      }
      process.exit(1);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.logger.log('🛑 MongoDB disconnected.');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`❌ Error during MongoDB disconnection: ${error.message}`);
      }
    }
  }

  private setupConnectionEvents(): void {
    if (!this.connection) return;

    this.connection.on('connected', () => {
      this.logger.log('📡 Mongoose connected to MongoDB.');
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('⚠️ Mongoose disconnected from MongoDB.');
    });

    this.connection.on('error', (error: Error) => {
      this.logger.error(`❌ Mongoose connection error: ${error.message}`);
    });

    this.connection.on('reconnected', () => {
      this.logger.log('🔄 Mongoose reconnected to MongoDB.');
    });
  }

  async withTransaction<T>(operation: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      void session.endSession();
    }
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
  }

  getConnection(): Connection | null {
    return this.connection;
  }
}
