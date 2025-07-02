import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Application } from './schemas/application.schema';
import mongoose, { Model } from 'mongoose';
import { CreateApplicationDto } from './dto/create-application';
import { GetApplicationFormDto } from './dto/get-application-form-dto';

@Injectable()
export class ApplicationFormService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
  ) {}

  async createApplication(createApplicationDto: CreateApplicationDto) {
    try {
      const application =
        await this.applicationModel.create(createApplicationDto);
      return application;
    } catch (error) {
      throw error;
    }
  }

  async getAllApplicationForm(getApplicationFormDto: GetApplicationFormDto) {
    const { limit = 10, page = 1 } = getApplicationFormDto;
    const skip = (page - 1) * limit;
    try {
      const total = await this.applicationModel.countDocuments({deletedAt:null});
      const totalPage = Math.ceil(total / limit);
      const applications = await this.applicationModel
        .find({deletedAt:null})
        .skip(skip)
        .limit(limit)
        .sort('-createdAt')
        .lean();
      return {
        data: applications,
        pagination: {
          total,
          page,
          limit,
          totalPage,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: mongoose.Types.ObjectId) {
    try {
      const application = await this.applicationModel.findById(id);
      if (!application) throw new BadRequestException('Application not found.');
      if (application.deletedAt)
        throw new BadRequestException('Application already deleted.');
      application.deletedAt = new Date();
      await application.save()
      return application
    } catch (error) {
        throw error
    }
  }
}
