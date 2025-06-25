import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bond } from './schemas/bond.schema';
import { Model } from 'mongoose';
import { CreateBondDto } from './dto/create-bond.dto';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { GetAllBonds } from './dto/get-all-bonds.dto';
import { UserRoles } from 'src/enum/user.enum';

@Injectable()
export class BondsService {
  constructor(@InjectModel(Bond.name) private bondModel: Model<Bond>) {}

  async createBond(createBondDto: CreateBondDto) {
    try {
      const isBondExist = await this.bondModel.exists({
        $or: [{ name: createBondDto.name }, { isin: createBondDto.isin }],
      });

      if (isBondExist)
        throw new BadRequestException(
          'Bond with name or ISIN number already exists.',
        );

      const bond = await this.bondModel.create(createBondDto);

      return bond;
    } catch (error) {
      throw error;
    }
  }

  async getBonds(user: JWTUserInterface, getAllBonds: GetAllBonds) {
    const { role } = user;
    const { limit = 10, page = 1 } = getAllBonds;
    const filter: { isPublic?: boolean } = {};
    if (role === UserRoles.USER) {
      filter.isPublic = true;
    }
    try {
      const skip = (page - 1) * limit;
      const total = await this.bondModel.countDocuments(filter);

      const bonds = await this.bondModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort('-createdAt')
        .lean();
      const totalPage = Math.ceil(total / limit);

      return {
        data: bonds,
        pagination: {
          total,
          page,
          limit,
          totalPage,
        },
      };
    } catch (error) {
        throw error
    }
  }
}
