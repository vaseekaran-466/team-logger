import { Request } from 'express';
import { Role } from '../enums/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  name: string;
}

export interface CurrentUserData extends JwtPayload {}

export interface AuthenticatedRequest extends Request {
  user: CurrentUserData;
}
