import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../common/enums/role.enum';
import { CurrentUserData } from '../common/interfaces/request.interfaces';
import { CreateLogDto } from './dto/create-log.dto';
import { FilterLogDto } from './dto/filter-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Log, LogDocument } from './schema/log.schema';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<LogDocument>) {}

  create(createLogDto: CreateLogDto, currentUser: CurrentUserData) {
    if (!currentUser?.sub) {
      throw new UnauthorizedException('User not found in token. Please login again');
    }

    return this.logModel.create({
      ...createLogDto,
      date: new Date(createLogDto.date),
      user: currentUser.sub,
    });
  }

  async findAll(filterDto: FilterLogDto, currentUser: CurrentUserData) {
    const query: {
      user?: string;
      date?: {
        $gte?: Date;
        $lte?: Date;
      };
    } = {};

    if (currentUser.role === Role.Employee) {
      query.user = currentUser.sub;
    }

    if (currentUser.role === Role.Manager && filterDto.userId) {
      query.user = filterDto.userId;
    }

    if (filterDto.startDate || filterDto.endDate) {
      query.date = {};

      if (filterDto.startDate) {
        query.date.$gte = new Date(filterDto.startDate);
      }

      if (filterDto.endDate) {
        query.date.$lte = new Date(filterDto.endDate);
      }
    }

    return this.logModel
      .find(query)
      .populate('user', 'name email role')
      .sort({ date: -1, createdAt: -1 })
      .lean();
  }

  async update(
    id: string,
    updateLogDto: UpdateLogDto,
    currentUser: CurrentUserData,
  ) {
    const existingLog = await this.logModel.findById(id);

    if (!existingLog) {
      throw new NotFoundException('Log not found');
    }

    this.ensureOwnership(existingLog.user.toString(), currentUser);

    if (updateLogDto.date) {
      existingLog.date = new Date(updateLogDto.date);
    }

    if (updateLogDto.workDescription !== undefined) {
      existingLog.workDescription = updateLogDto.workDescription;
    }

    if (updateLogDto.hoursWorked !== undefined) {
      existingLog.hoursWorked = updateLogDto.hoursWorked;
    }

    await existingLog.save();

    return this.logModel
      .findById(id)
      .populate('user', 'name email role')
      .lean();
  }

  async remove(id: string, currentUser: CurrentUserData) {
    const existingLog = await this.logModel.findById(id);

    if (!existingLog) {
      throw new NotFoundException('Log not found');
    }

    this.ensureOwnership(existingLog.user.toString(), currentUser);
    await existingLog.deleteOne();

    return { message: 'Log deleted successfully' };
  }

  private ensureOwnership(logUserId: string, currentUser: CurrentUserData) {
    if (currentUser.role === Role.Manager) {
      return;
    }

    if (logUserId !== currentUser.sub) {
      throw new ForbiddenException('You can only manage your own logs');
    }
  }
}
