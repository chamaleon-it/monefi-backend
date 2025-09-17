import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProofFileDto {
    @IsString()
    proof: string;

    @IsString()
    file: string;
}

export class KycDto {
    @ValidateNested()
    @Type(() => ProofFileDto)
    identityVerification: ProofFileDto;

    @ValidateNested()
    @Type(() => ProofFileDto)
    proofOfAddress: ProofFileDto;
}
