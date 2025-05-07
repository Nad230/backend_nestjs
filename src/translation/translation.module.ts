import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TranslateService } from './translation.service';
import { TranslateController } from './translation.controller';

@Module({
  
  controllers: [TranslateController],
  providers: [TranslateService],
})
export class TranslateModule {}