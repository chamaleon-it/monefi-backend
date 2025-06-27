
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InvestmentType } from 'src/enum/investment-type.enum';

export type PortfolioDocument = HydratedDocument<Portfolio>;

@Schema({timestamps:true,versionKey:false})
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

      @Prop({required:true,type:mongoose.SchemaTypes.ObjectId,ref:"Transaction"})
      transaction:mongoose.Types.ObjectId

}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
