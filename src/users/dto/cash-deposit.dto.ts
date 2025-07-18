import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CashDepositDto{
    @IsNotEmpty({ message: "Amount is required." })
    @IsNumber({}, { message: "Amount must be a number." })
    @IsPositive({ message: "Amount must be a positive number." })
    amount: number
}