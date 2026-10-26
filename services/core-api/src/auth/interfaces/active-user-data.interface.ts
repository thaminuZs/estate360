import { Role } from '../enums/role.enum';

export interface ActiveUserData {
  sub: string;
  email: string;
  role: Role;
  ownerId?: string | null;
}
