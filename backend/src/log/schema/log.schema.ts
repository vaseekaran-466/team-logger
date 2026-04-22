import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schema/create-user.schema';

export type LogDocument = HydratedDocument<Log>;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, trim: true })
  workDescription: string;

  @Prop({ required: true, min: 0.5, max: 24 })
  hoursWorked: number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
}

export const LogSchema = SchemaFactory.createForClass(Log);
