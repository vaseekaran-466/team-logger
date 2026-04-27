import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuardModule } from '../auth/auth-guard.module';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { Log, LogSchema } from './schema/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    AuthGuardModule,
  ],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
