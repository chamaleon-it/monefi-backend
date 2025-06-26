import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InvestmentType } from 'src/enum/investment-type.enum';
import { TransactionStatus } from 'src/enum/transaction-status.enum';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true, versionKey: false })
export class Transaction {
  @Prop({ required: true,trim:true })
  symbol: string;

  @Prop({ required: true,trim:true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  totalValue: number;

  @Prop({
    required: true,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Prop({ required: true, enum: InvestmentType })
  investmentType: InvestmentType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Bond' })
  bond: mongoose.Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
