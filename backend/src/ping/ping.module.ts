/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PingController } from './ping.controller';

@Module({
    controllers: [PingController],
})
export class PingModule { }
