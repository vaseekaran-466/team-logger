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

  async create(createLogDto: CreateLogDto, currentUser: CurrentUserData) {
    if (!currentUser?.sub) {
      throw new UnauthorizedException(
        'User not found in token. Please login again',
      );
    }

    return this.logModel.create({
      workDescription: createLogDto.workDescription,
      hoursWorked: createLogDto.hoursWorked,
      date: new Date(createLogDto.date),
      user: currentUser.sub,
    });
  }

  async findAll(filterDto: FilterLogDto, currentUser: CurrentUserData) {
    const query: Record<string, any> = {};

    if (currentUser.role === Role.Employee) {
      query.user = currentUser.sub;
    }

    if (currentUser.role === Role.Manager && filterDto.userId) {
      query.user = filterDto.userId;
    }

    if (filterDto.startDate || filterDto.endDate) {
      query.date = {};

      const hasStartDate = Boolean(filterDto.startDate);
      const hasEndDate = Boolean(filterDto.endDate);

      // If only a YYYY-MM-DD date is provided (no time) and endDate is not set,
      // treat it as a single-day filter in UTC to avoid timezone off-by-one issues.
      if (hasStartDate && !hasEndDate && /^\d{4}-\d{2}-\d{2}$/.test(filterDto.startDate!)) {
        const startOfDayUtc = new Date(`${filterDto.startDate}T00:00:00.000Z`);
        const nextDayUtc = new Date(startOfDayUtc);
        nextDayUtc.setUTCDate(nextDayUtc.getUTCDate() + 1);

        query.date.$gte = startOfDayUtc;
        query.date.$lt = nextDayUtc;
      } else if (hasStartDate) {
        query.date.$gte = new Date(filterDto.startDate!);
      }

      if (hasEndDate) {
        query.date.$lte = new Date(filterDto.endDate!);
      }
    }

    const logs = await this.logModel
      .find(query)
      .populate('user', 'name email role')
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return logs;
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

    if (existingLog.user.toString() !== currentUser.sub) {
      throw new ForbiddenException('You can only manage your own logs');
    }

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

    const updatedLog = await this.logModel
      .findById(id)
      .populate('user', 'name email role')
      .lean();

    return updatedLog;
  }

  async remove(id: string, currentUser: CurrentUserData) {
    const existingLog = await this.logModel.findById(id);

    if (!existingLog) {
      throw new NotFoundException('Log not found');
    }

    if (existingLog.user.toString() !== currentUser.sub) {
      throw new ForbiddenException('You can only manage your own logs');
    }

    await existingLog.deleteOne();

    return { message: 'Log deleted successfully' };
  }
}
