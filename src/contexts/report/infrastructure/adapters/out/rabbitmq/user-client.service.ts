import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserPatterns } from './user.patterns';

export interface UserRoleResponse {
  role: string;
}

export interface UserDataResponse {
  id: string;
  username: string;
  name: string;
  lastname: string;
  profilePicURL: string | null;
  email: string;
}

@Injectable()
export class UserClientService {
  constructor(
    @Inject('USER_SERVICE') private client: ClientProxy,
  ) {}

  async getUserRole(userId: string): Promise<UserRoleResponse> {
    try {
      const response = this.client.send(UserPatterns.GET_USER_ROLE, { userId });
      return await response.toPromise() as UserRoleResponse;
    } catch (error) {
      throw new Error(`Failed to get user role: ${error.message}`);
    }
  }

  async getUserRoleByEmail(email: string): Promise<UserRoleResponse> {
    try {
      const response = this.client.send(UserPatterns.GET_USER_ROLE_BY_EMAIL, { email });
      return await response.toPromise() as UserRoleResponse;
    } catch (error) {
      throw new Error(`Failed to get user role by email: ${error.message}`);
    }
  }

  async isAdmin(email: string): Promise<boolean> {
    const user = await this.getUserRoleByEmail(email);
    return user?.role === 'ADMIN';
  }

  async getUserById(userId: string): Promise<UserDataResponse | null> {
    try {
      const response = this.client.send(
        UserPatterns.GET_USER_BY_ID,
        { userId }
      );
      const result = await response.toPromise() as { user: UserDataResponse | null; error?: string };
      if (result.error || !result.user) {
        return null;
      }
      return result.user;
    } catch (error) {
      return null;
    }
  }
}