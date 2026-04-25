import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserPatterns } from './user.patterns';

export interface UserRoleResponse {
  role: string;
}

@Injectable()
export class UserClientService {
  constructor(
    @Inject('USER_SERVICE') private client: ClientProxy,
  ) {}

  async getUserRole(userId: string): Promise<UserRoleResponse> {
    try {
      const response = this.client.send(
        UserPatterns.GET_USER_ROLE,
        { userId }
      );
      return response.toPromise() as Promise<UserRoleResponse>;
    } catch (error) {
      throw new Error(`Failed to get user role: ${error.message}`);
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.getUserRole(userId);
    return user.role === 'ADMIN';
  }
}