import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InvestmentType } from 'src/enum/investment-type.enum';
import { YesOrNoEnum } from 'src/enum/yes-or-no.enum';

export type PortfolioDocument = HydratedDocument<Portfolio>;

@Schema({ timestamps: true, versionKey: false })
export class Portfolio {
  @Prop({ required: true, trim: true })
  symbol: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  totalValue: number;

  @Prop({ required: true, enum: InvestmentType })
  investmentType: InvestmentType;

  @Prop({ default: null, type: String })
  certificate: null | string;

  @Prop({
    required: true,
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Transaction',
  })
  transaction: mongoose.Types.ObjectId;

  @Prop({
    default: 'Yes',
    enum: YesOrNoEnum,
  })
  buyBack: YesOrNoEnum;

  @Prop({
    default: [],
    type: [
      {
        date: Date,
        amount: Number,
      },
    ],
  })
  interest: {
    date: Date;
    amount: number;
  }[];
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
