import {
  ConflictException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Role } from '../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/create-user.schema';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async onModuleInit() {
    await this.seedDefaultUsers();
  }

  async seedDefaultUsers() {
    const totalUsers = await this.userModel.countDocuments();

    if (totalUsers > 0) {
      return;
    }

    const defaultUsers: CreateUserDto[] = [
      {
        name: process.env.DEFAULT_MANAGER_NAME ?? 'Manager User',
        email: process.env.DEFAULT_MANAGER_EMAIL ?? 'manager@teamlogger.com',
        password: process.env.DEFAULT_MANAGER_PASSWORD ?? '',
        role: Role.Manager,
      },
    ];

    for (const user of defaultUsers) {
      await this.create(user);
    }
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email.toLowerCase(),
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.userModel.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
    });
  }

  findAll() {
    return this.userModel
      .find()
      .select('-password')
      .sort({ name: 1 })
      .lean();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).lean();
  }

  findById(id: string) {
    return this.userModel.findById(id).select('-password').lean();
  }
}
