import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CouponFrequency } from 'src/enum/coupon-frequency.enum';
import { CouponType } from 'src/enum/coupon-type.enum';

export type BondDocument = HydratedDocument<Bond>;

@Schema({ timestamps: true, versionKey: false })
export class Bond {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  annualCouponRate: number;

  @Prop({ required: true, unique: true })
  isin: string;

  @Prop({ enum: CouponFrequency, required: true })
  couponFrequency: CouponFrequency;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true, enum: CouponType })
  couponType: CouponType;

  @Prop({ type: Date })
  meturityDate: Date;

  @Prop({ default: true })
  isPublic: boolean;
}

export const BondSchema = SchemaFactory.createForClass(Bond);
