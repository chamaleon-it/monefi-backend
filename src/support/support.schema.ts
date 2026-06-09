import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { SupportTicketStatus, SupportTicketSubject } from '../enum/support.enum';
import { User } from 'src/users/schemas/user.schema';

export type SupportTicketDocument = SupportTicket & Document;

@Schema({ timestamps: true })
export class SupportTicket {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User | mongoose.Types.ObjectId;

  @Prop({ type: String, enum: SupportTicketSubject, required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: String, enum: SupportTicketStatus, default: SupportTicketStatus.OPEN })
  status: string;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);
