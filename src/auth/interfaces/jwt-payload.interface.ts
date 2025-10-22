import { UserRole } from '../../users/enums/user-role.enum';

export interface JwtPayload {
  sub: string;
  username: string;
  roles: UserRole;
  iat?: number;
  exp?: number;
}
