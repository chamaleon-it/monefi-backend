import mongoose from 'mongoose';
import { UserRoles } from 'src/enum/user.enum';

export interface JWTUserInterface {
  id: mongoose.Types.ObjectId;
  email: string;
  role: UserRoles;
}
