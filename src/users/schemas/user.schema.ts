import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserStatus } from 'src/enum/user-status.enum';
import { UserRoles } from 'src/enum/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ unique: true, required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Prop({ required: true, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ default: null, type: String, select: false })
  refreshToken: string | null;

  @Prop({ default: null, type: Date })
  lastLogin: Date | string;

  @Prop({default:0})
  balance:number

}

export const UserSchema = SchemaFactory.createForClass(User);
