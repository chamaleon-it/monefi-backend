import { IsMongoId } from "class-validator";
import mongoose from "mongoose";

export class DeleteUserDto {
    @IsMongoId()
    id:mongoose.Types.ObjectId
}