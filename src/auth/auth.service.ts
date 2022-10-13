import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDocument } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(@InjectModel('user') private authModel: Model<AuthDocument>) {}

  async create(createAuthDto: CreateAuthDto) {
    const res = new this.authModel(createAuthDto);
    return res.save();
  }
}
