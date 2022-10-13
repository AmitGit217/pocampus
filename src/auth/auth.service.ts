import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDocument } from './entities/auth.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel('user') private authModel: Model<AuthDocument>) {}

  async create(createAuthDto: CreateAuthDto) {
    try {
      const res = await this.authModel.create(createAuthDto);
      return res.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('Credentials taken');
      }
    }
  }
}
