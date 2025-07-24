import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({ timestamps: true, versionKey: false })
export class Application {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true, enum: ['Individual', 'Joint', 'Company'] })
  accountType: 'Individual' | 'Joint' | 'Company';

  @Prop({
    type: {
      name: String,
      companyType: { type: String, enum: ['Public', 'Proprietary'] },
      companyNumber: String,
      taxCode: String,
      taxCodeExemption: { type: String, enum: ['Yes', 'No'] },
      dateOfRegistration: String,
      natureOfBusiness: String,
      category: {
        type: String,
        enum: [
          'Limited Company',
          'Publicly Listed Company',
          'Majority owned subsidiary of a listed company',
          'Regulated company',
          'None of the above',
        ],
      },
      address: String,
      streetName: String,
      town: String,
      region: String,
      postcode: String,
      country: String,
      companyTaxInformation: {
        type: String,
        enum: [
          'Financial Institution',
          'Public Listed Company, Majority owned subsidiary of a Public Listed Company or a Registered Charity',
          ' Active Non-Financial Entity (NFE)',
          'None of the above',
        ],
      },
      companyOwnership: { type: String, enum: ['Yes', 'No'] },
    },
  })
  company?: {
    name: string;
    companyType: 'Public' | 'Proprietary';
    companyNumber: string;
    taxCode: string;
    taxCodeExemption: 'Yes' | 'No';
    dateOfRegistration: string;
    natureOfBusiness: string;
    category:
      | 'Limited Company'
      | 'Publicly Listed Company'
      | 'Majority owned subsidiary of a listed company'
      | 'Regulated company'
      | 'None of the above';
    address: string;
    streetName: string;
    town: string;
    region: string;
    postcode: string;
    country: string;
    companyTaxInformation:
      | 'Financial Institution'
      | 'Public Listed Company, Majority owned subsidiary of a Public Listed Company or a Registered Charity'
      | ' Active Non-Financial Entity (NFE)'
      | 'None of the above';
    companyOwnership: 'Yes' | 'No';
  };

  @Prop() title: string;
  @Prop() firstName: string;
  @Prop() lastName: string;
  @Prop() dateOfBirth: string;
  @Prop() occupation: string;
  @Prop() occupationCategory: string;
  @Prop() homePhone: string;
  @Prop() mobilePhone: string;
  @Prop() password: string;
  @Prop() confirmPassword: string;
  @Prop() country: string;
  @Prop() houseNumberOrName: string;
  @Prop() streetName: string;
  @Prop() town: string;
  @Prop() region: string;
  @Prop() postcode: string;

  @Prop({
    type: {
      title: String,
      firstName: String,
      lastName: String,
      dateOfBirth: String,
      occupation: String,
      occupationCategory: String,
      homePhone: String,
      mobilePhone: String,
      country: String,
      houseNumberOrName: String,
      streetName: String,
      town: String,
      region: String,
      postcode: String,
    },
  })
  jointHolder?: {
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    occupation: string;
    occupationCategory: string;
    homePhone: string;
    mobilePhone: string;
    country: string;
    houseNumberOrName: string;
    streetName: string;
    town: string;
    region: string;
    postcode: string;
  };

  @Prop({
    enum: [
      'International travel document',
      'Driving Licence',
      'Email Identification',
    ],
  })
  identityVerification: string;

  @Prop()
  identityVerificationFile?: string;

  @Prop()
  backIdentityVerificationFile?:string

  @Prop({
    enum: ['Utility Bill', 'Driving Licence', 'Email Proof of Address'],
  })
  proofOfAddress?: string;

  @Prop()
  proofOfAddressFile?: string;

  @Prop()
  backProofOfAddressFile?: string;

  @Prop({
    enum: [
      'Savings',
      'Growth',
      'Income',
      'Retirement',
      'Business account',
      'Other',
    ],
  })
  purposeOfAccount: string;

  @Prop({
    enum: [
      'Provide Existing Bank Account Details',
      'Email Existing Bank Account Details',
    ],
  })
  bankAccount: string;

  @Prop({
    type: {
      bankName: String,
      branchName: String,
      accountName: String,
      accountNumber: String,
      sortCode: String,
    },
  })
  bankAccountDetails?: {
    bankName: string;
    branchName?: string;
    accountName: string;
    accountNumber: string;
    sortCode: string;
  };

  @Prop({
    type: {
      name: String,
      homePhone: String,
      mobilePhone: String,
      email: String,
    },
  })
  nextOfKinName: {
    name: string;
    homePhone: string;
    mobilePhone: string;
    email: string;
  };

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
