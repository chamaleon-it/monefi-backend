import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { SupportTicket, SupportTicketDocument } from './support.schema';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(SupportTicket.name) private supportTicketModel: Model<SupportTicketDocument>,
  ) { }

  async create(userId: mongoose.Types.ObjectId, createDto: CreateSupportTicketDto): Promise<SupportTicket> {
    const ticket = new this.supportTicketModel({
      ...createDto,
      user: new Types.ObjectId(userId),
    });
    return ticket.save();
  }

  async findAll(userId?: string): Promise<SupportTicket[]> {
    const query = userId ? { user: new Types.ObjectId(userId) } : {};
    return this.supportTicketModel.find(query).populate('user', 'name email').sort({ createdAt: -1 }).exec();
  }

  async updateStatus(id: string, updateDto: UpdateSupportTicketDto): Promise<SupportTicket> {
    const ticket = await this.supportTicketModel.findByIdAndUpdate(
      id,
      { status: updateDto.status },
      { new: true },
    ).exec();

    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }

    return ticket;
  }
}
