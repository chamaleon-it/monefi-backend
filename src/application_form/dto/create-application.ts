import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsDateString,
  Matches,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class CompanyDto {
  @IsString() name: string;

  @IsIn(['Public', 'Proprietary']) companyType: 'Public' | 'Proprietary';

  @IsString() companyNumber: string;

  @IsString() taxCode: string;

  @IsIn(['Yes', 'No']) taxCodeExemption: 'Yes' | 'No';

  @IsDateString() dateOfRegistration: string;

  @IsString() natureOfBusiness: string;

  @IsIn([
    'Limited Company',
    'Publicly Listed Company',
    'Majority owned subsidiary of a listed company',
    'Regulated company',
    'None of the above',
  ])
  category:
    | 'Limited Company'
    | 'Publicly Listed Company'
    | 'Majority owned subsidiary of a listed company'
    | 'Regulated company'
    | 'None of the above';

  @IsString() address: string;
  @IsString() streetName: string;
  @IsString() town: string;
  @IsString() region: string;
  @IsString() postcode: string;
  @IsString() country: string;

  @IsIn([
    'Financial Institution',
    'Public Listed Company, Majority owned subsidiary of a Public Listed Company or a Registered Charity',
    ' Active Non-Financial Entity (NFE)',
    'None of the above',
  ])
  companyTaxInformation:
    | 'Financial Institution'
    | 'Public Listed Company, Majority owned subsidiary of a Public Listed Company or a Registered Charity'
    | ' Active Non-Financial Entity (NFE)'
    | 'None of the above';

  @IsIn(['Yes', 'No']) companyOwnership: 'Yes' | 'No';
}

class JointHolderDto {
  @IsString() title: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsDateString() dateOfBirth: string;
  @IsString() occupation: string;
  @IsString() occupationCategory: string;
  @IsString() homePhone: string;
  @IsString() mobilePhone: string;
  @IsString() country: string;
  @IsString() houseNumberOrName: string;
  @IsString() streetName: string;
  @IsString() town: string;
  @IsString() region: string;
  @IsString() postcode: string;
}

class BankAccountDetailsDto {
  @IsString() bankName: string;
  
  @IsOptional()
  @IsString()
   branchName?: string;
  @IsString() accountName: string;
  @IsString() accountNumber: string;
  @IsString() sortCode: string;
}

class NextOfKinDto {
  @IsString() name: string;
  @IsString() homePhone: string;
  @IsString() mobilePhone: string;
  @IsEmail() email: string;
}

export class CreateApplicationDto {
  @IsEmail() email: string;

  @IsIn(['Individual', 'Joint', 'Company'])
  accountType: 'Individual' | 'Joint' | 'Company';

  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyDto)
  company?: CompanyDto;

  @IsString() title: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsDateString() dateOfBirth: string;
  @IsString() occupation: string;
  @IsString() occupationCategory: string;
  @IsString() homePhone: string;
  @IsString() mobilePhone: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters, include one letter and one number',
  })
  password: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
    message:
      'Confirm password must be at least 8 characters, include one letter and one number',
  })
  confirmPassword: string;

  @IsString() country: string;
  @IsString() houseNumberOrName: string;
  @IsString() streetName: string;
  @IsString() town: string;
  @IsString() region: string;
  @IsString() postcode: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => JointHolderDto)
  jointHolder?: JointHolderDto;

  @IsIn([
    'International travel document',
    'Driving Licence',
    'Email Identification',
  ])
  identityVerification:
    | 'International travel document'
    | 'Driving Licence'
    | 'Email Identification';

  @IsOptional()
  @IsString()
  identityVerificationFile?: string;

  @IsIn(['Utility Bill', 'Driving Licence', 'Email Proof of Address'])
  proofOfAddress: 'Utility Bill' | 'Driving Licence' | 'Email Proof of Address';

  @IsOptional()
  @IsString()
  proofOfAddressFile?: string;

  @IsIn([
    'Savings',
    'Growth',
    'Income',
    'Retirement',
    'Business account',
    'Other',
  ])
  purposeOfAccount:
    | 'Savings'
    | 'Growth'
    | 'Income'
    | 'Retirement'
    | 'Business account'
    | 'Other';

  @IsIn([
    'Provide Existing Bank Account Details',
    'Email Existing Bank Account Details',
  ])
  bankAccount:
    | 'Provide Existing Bank Account Details'
    | 'Email Existing Bank Account Details';

  @IsOptional()
  @ValidateNested()
  @Type(() => BankAccountDetailsDto)
  bankAccountDetails?: BankAccountDetailsDto;

  @ValidateNested()
  @Type(() => NextOfKinDto)
  nextOfKinName: NextOfKinDto;
}
