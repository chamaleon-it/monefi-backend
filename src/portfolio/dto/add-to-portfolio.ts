import { IsEnum, IsMongoId, isMongoId, IsNumber, IsString } from "class-validator"
import mongoose, { Mongoose } from "mongoose"
import { InvestmentType } from "src/enum/investment-type.enum"

export class AddToPortfolioDto{
    @IsString()
    symbol:string

    @IsString()
    name:string

    @IsMongoId()
    user:mongoose.Types.ObjectId

    @IsNumber()
    quantity:number

    @IsNumber()
    unitPrice:number
    @IsNumber()
    totalValue:number

    @IsEnum(InvestmentType)
    investmentType:InvestmentType

    @IsMongoId()
    transaction:mongoose.Types.ObjectId

}