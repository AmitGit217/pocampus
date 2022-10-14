import { LoginAuthDto } from './../src/auth/dto/login-auth.dto';
import { CreateAuthDto } from './../src/auth/dto/create-auth.dto';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

describe('Auth e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/pocampus-test'),
        AuthModule,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    mongoose.connect('mongodb://localhost/pocampus-test');
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await app.close();
  });

  describe('Signup', () => {
    const user: CreateAuthDto = {
      name: 'name',
      email: 'email@email.com',
      phone: '0524207807',
      password: '123456',
    };
    const invalidEmail = {
      name: 'name',
      email: 'email?',
      phone: '0524207807',
      password: '123456',
    };
    const invalidPhone = {
      name: 'name',
      email: 'email@email.com',
      phone: '1234',
      password: '123456',
    };
    it('Should return 201 status code for success /auth/signup', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user);
      expect(res.status).toBe(201);
      expect(res.body.name).toBe(user.name);
      expect(res.body.email).toBe(user.email);
      expect(res.body.phone).toBe(user.phone);
      expect(res.body.institutes).toStrictEqual([]);
      expect(res.body.majors).toStrictEqual([]);
      expect(typeof res.body.password).toBe('string');
    });
    it('Should return 403 status for taken credentials /auth/signup', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user);
      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Credentials taken');
    });
    it('Should return 400 status for invalid email /auth/signup', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(invalidEmail);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid data');
    });
    it('Should return 400 status for invalid phone /auth/signup', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(invalidPhone);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid data');
    });
  });

  describe('Login', () => {
    it('Should return 200 status code with token /auth/login', async () => {
      const validLogin: LoginAuthDto = {
        email: 'email@email.com',
        password: '123456',
      };
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(validLogin);
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });
    it('Should return 404 status code for not found /auth/login', async () => {
      const invalidLoginEmail: LoginAuthDto = {
        email: 'email@email',
        password: '123456',
      };
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginEmail);
      expect(res.status).toBe(404);
    });
    it('Should return 403 status code for incorrect credentials /auth/login', async () => {
      const invalidLoginPassword: LoginAuthDto = {
        email: 'email@email.com',
        password: '123',
      };
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginPassword);
      expect(res.status).toBe(403);
    });
  });
});
