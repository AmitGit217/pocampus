import { AuthSchema } from './entities/auth.entity';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: AuthSchema }])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
