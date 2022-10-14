import { LoginAuthDto } from './dto/login-auth.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private authModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(createAuthDto: CreateAuthDto): Promise<User> {
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

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const res = await this.authModel.findOne({ email });
    if (!res) {
      throw new NotFoundException('User not found');
    }
    const passMatch = await bcrypt.compare(password, res.password);
    if (!passMatch) {
      throw new ForbiddenException('Credentials incorrect');
    }
    return this.signToken({ id: res._id });
  }

  private async signToken(
    payload: Record<string, string>,
  ): Promise<{ token: string }> {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return { token };
  }
}
