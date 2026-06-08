import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IpoRequestStatus } from 'src/enum/ipo-request-status.enum';
import { User } from 'src/users/schemas/user.schema';
import { Ipo } from './ipo.schema';

export type IpoRequestDocument = HydratedDocument<IpoRequest>;

@Schema({ timestamps: true, versionKey: false })
export class IpoRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User | mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ipo', required: true })
  ipo: Ipo | mongoose.Types.ObjectId;

  @Prop({
    required: true,
    enum: IpoRequestStatus,
    default: IpoRequestStatus.PENDING,
  })
  status: IpoRequestStatus;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalAmount: number;
}

export const IpoRequestSchema = SchemaFactory.createForClass(IpoRequest);
