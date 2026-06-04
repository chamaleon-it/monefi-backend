import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IpoStatus } from 'src/enum/ipo-status.enum';

export type IpoDocument = HydratedDocument<Ipo>;

@Schema({ timestamps: true, versionKey: false })
export class Ipo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  stockSymbol: string;

  @Prop({ required: true, type: Date })
  openDate: Date;

  @Prop({ required: true, type: Date })
  closeDate: Date;

  @Prop({ required: true, type: Date })
  listingDate: Date;

  @Prop({ required: true })
  priceBandMin: number;

  @Prop({ required: true })
  priceBandMax: number;

  @Prop({ required: true })
  lotSize: number;

  @Prop({ required: true })
  issueSize: number;

  @Prop({ required: true })
  price: number;

  @Prop({ default: null })
  companyDescription: string;

  @Prop({ default: null })
  officialWebsite: string;

  @Prop({ required: true, enum: IpoStatus, default: IpoStatus.OPEN })
  status: IpoStatus;

  @Prop({ default: true })
  isPublic: boolean;
}

export const IpoSchema = SchemaFactory.createForClass(Ipo);
