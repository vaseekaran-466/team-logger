import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create({
      ...registerDto,
      role: Role.Employee,
    });

    return this.buildAuthResponse({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  private async buildAuthResponse(user: {
    _id: unknown;
    name: string;
    email: string;
    role: Role;
  }) {
    const userId = String(user._id);

    const payload = {
      sub: userId,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET ?? 'team-logger-secret',
        expiresIn: Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 86400),
      }),
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
