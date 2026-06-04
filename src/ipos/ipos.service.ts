import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ipo } from './schemas/ipo.schema';
import { IpoRequest } from './schemas/ipo-request.schema';
import { CreateIpoDto } from './dto/create-ipo.dto';
import { UpdateIpoDto } from './dto/update-ipo.dto';
import { UpdateIpoRequestDto } from './dto/update-ipo-request.dto';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { GetAllIpos } from './dto/get-all-ipos.dto';
import { GetAllIpoRequests } from './dto/get-all-ipo-requests.dto';
import { UserRoles } from 'src/enum/user.enum';
import { IpoRequestStatus } from 'src/enum/ipo-request-status.enum';

@Injectable()
export class IposService {
  constructor(
    @InjectModel(Ipo.name) private ipoModel: Model<Ipo>,
    @InjectModel(IpoRequest.name) private ipoRequestModel: Model<IpoRequest>,
  ) {}

  async createIpo(createIpoDto: CreateIpoDto) {
    const isIpoExist = await this.ipoModel.exists({
      stockSymbol: createIpoDto.stockSymbol,
    });

    if (isIpoExist) {
      throw new BadRequestException(
        'IPO with this stock symbol already exists.',
      );
    }

    const ipo = await this.ipoModel.create(createIpoDto);
    return ipo;
  }

  async getIpos(user: JWTUserInterface, getAllIpos: GetAllIpos) {
    const { limit = 10, page = 1 } = getAllIpos;
    const filter: { isPublic?: boolean } = {};

    // Clients only see public IPOs
    if (user.role === UserRoles.USER) {
      filter.isPublic = true;
    }

    const skip = (page - 1) * limit;
    const total = await this.ipoModel.countDocuments(filter);

    const ipos = await this.ipoModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort('-createdAt')
      .lean();
    const totalPage = Math.ceil(total / limit);

    return {
      data: ipos,
      pagination: {
        total,
        page,
        limit,
        totalPage,
      },
    };
  }

  async updateIpo(ipoId: string, updateIpoDto: UpdateIpoDto) {
    const ipo = await this.ipoModel.findById(ipoId);
    if (!ipo) {
      throw new NotFoundException('IPO not found.');
    }

    if (updateIpoDto.status !== undefined) {
      ipo.status = updateIpoDto.status;
    }
    if (updateIpoDto.isPublic !== undefined) {
      ipo.isPublic = updateIpoDto.isPublic;
    }

    await ipo.save();
    return ipo;
  }

  async deleteIpo(ipoId: string) {
    const ipo = await this.ipoModel.findById(ipoId);
    if (!ipo) {
      throw new NotFoundException('IPO not found.');
    }

    // Also delete all related requests
    await this.ipoRequestModel.deleteMany({ ipo: new Types.ObjectId(ipoId) });
    await this.ipoModel.findByIdAndDelete(ipoId);

    return { message: 'IPO deleted successfully.' };
  }

  async getIpoDetails(ipoId: string) {
    const ipo = await this.ipoModel.findById(ipoId).lean();
    if (!ipo) {
      throw new NotFoundException('IPO not found.');
    }

    const totalRequests = await this.ipoRequestModel.countDocuments({
      ipo: new Types.ObjectId(ipoId),
    });

    const approvedRequests = await this.ipoRequestModel.countDocuments({
      ipo: new Types.ObjectId(ipoId),
      status: IpoRequestStatus.APPROVED,
    });

    const pendingRequests = await this.ipoRequestModel.countDocuments({
      ipo: new Types.ObjectId(ipoId),
      status: IpoRequestStatus.PENDING,
    });

    const rejectedRequests = await this.ipoRequestModel.countDocuments({
      ipo: new Types.ObjectId(ipoId),
      status: IpoRequestStatus.REJECTED,
    });

    return {
      ...ipo,
      totalRequests,
      approvedRequests,
      pendingRequests,
      rejectedRequests,
    };
  }

  async requestIpo(user: JWTUserInterface, ipoId: string) {
    const ipo = await this.ipoModel.findById(ipoId);
    if (!ipo) {
      throw new NotFoundException('IPO not found.');
    }

    const existingRequest = await this.ipoRequestModel.exists({
      user: new Types.ObjectId(user.id),
      ipo: new Types.ObjectId(ipoId),
    });

    if (existingRequest) {
      throw new BadRequestException('You have already requested this IPO.');
    }

    const ipoRequest = await this.ipoRequestModel.create({
      user: new Types.ObjectId(user.id),
      ipo: new Types.ObjectId(ipoId),
    });

    return ipoRequest;
  }

  async getAllRequests(getAllIpoRequests: GetAllIpoRequests) {
    const { limit = 10, page = 1 } = getAllIpoRequests;
    const skip = (page - 1) * limit;

    const total = await this.ipoRequestModel.countDocuments();
    const requests = await this.ipoRequestModel
      .find()
      .populate('user', 'firstName lastName email')
      .populate('ipo', 'name stockSymbol companyName')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt')
      .lean();

    const totalPage = Math.ceil(total / limit);

    return {
      data: requests,
      pagination: {
        total,
        page,
        limit,
        totalPage,
      },
    };
  }

  async getMyRequests(
    user: JWTUserInterface,
    getAllIpoRequests: GetAllIpoRequests,
  ) {
    const { limit = 10, page = 1 } = getAllIpoRequests;
    const skip = (page - 1) * limit;

    const filter = { user: new Types.ObjectId(user.id) };
    const total = await this.ipoRequestModel.countDocuments(filter);

    const requests = await this.ipoRequestModel
      .find(filter)
      .populate('ipo', 'name stockSymbol companyName')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt')
      .lean();

    const totalPage = Math.ceil(total / limit);

    return {
      data: requests,
      pagination: {
        total,
        page,
        limit,
        totalPage,
      },
    };
  }

  async updateRequestStatus(
    requestId: string,
    updateDto: UpdateIpoRequestDto,
  ) {
    const request = await this.ipoRequestModel.findById(requestId);
    if (!request) {
      throw new NotFoundException('IPO request not found.');
    }

    request.status = updateDto.status;
    await request.save();

    return request;
  }
}
