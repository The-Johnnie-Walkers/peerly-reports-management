import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHelperService {
  constructor(private jwtService: JwtService) {}

  extractUserIdFromToken(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid or missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = this.jwtService.verify(token);
      return decoded.sub;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}