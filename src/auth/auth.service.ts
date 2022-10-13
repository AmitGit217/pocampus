import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './schemas/auth.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel('user') private authModel: Model<AuthDocument>) {}

  async signup(createAuthDto: CreateAuthDto): Promise<Auth> {
    try {
      const hash = await bcrypt.hash(createAuthDto.password, 10);
      const newUser = await this.authModel.create({
        ...createAuthDto,
        password: hash,
      });
      //TODO: Find a way to exclude the password from the response
      return newUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('Credentials taken');
      } else {
        throw new BadRequestException('Invalid data');
      }
    }
  }
}
