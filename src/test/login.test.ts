// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';

import { app } from '../app';
import * as UserService from '../service/user.service';

describe('login', () => {
  describe('given an username with more than 20 characters', () => {
    it('should return an error', async () => {
      const response: any = await request(app)
        .post('/api/v1/users/login')
        .send({
          username:
            'adiosssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
          email: 'test@gmail.com',
          password: 'test',
        });
      expect(response.body.errors[0].msg).toBe('Invalid value');
      expect(response.body.errors[0].param).toBe('username');
    });
  });
  describe('given an username with no characters', () => {
    it('should return an error', async () => {
      const response: any = await request(app)
        .post('/api/v1/users/login')
        .send({
          username: '',
          email: 'test@gmail.com',
          password: 'test',
        });
      expect(response.body.errors[0].msg).toBe('Invalid value');
      expect(response.body.errors[0].param).toBe('username');
    });
  });
  describe('given an email with more than 30 characters', () => {
    it('should return an error', async () => {
      const response: any = await request(app)
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          email:
            'testtttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt@gmail.com',
          password: 'test',
        });
      expect(response.body.errors[0].msg).toBe('Invalid value');
      expect(response.body.errors[0].param).toBe('email');
    });
  });
  describe('given an email with no characters', () => {
    it('should return an error', async () => {
      const response: any = await request(app)
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          email: '',
          password: 'test',
        });
      expect(response.body.errors[0].msg).toBe('Invalid value');
      expect(response.body.errors[0].param).toBe('email');
    });
  });
  describe('given an email with wrong format', () => {
    it('should return an error', async () => {
      const response: any = await request(app)
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          email: 'test.com',
          password: 'test',
        });
      expect(response.body.errors[0].msg).toBe('Invalid value');
      expect(response.body.errors[0].param).toBe('email');
    });
  });
  describe('given an password with more than 20 characters', () => {
    it('should return an error', async () => {
      const response: any = await request(app)
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          email: 'test@gmail.com',
          password:
            'testinggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
        });
      expect(response.body.errors[0].msg).toBe('Invalid value');
      expect(response.body.errors[0].param).toBe('password');
    });
  });
  describe('given an password with no characters', () => {
    it('should return an error', async () => {
      const response: any = await request(app)
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          email: 'test@gmail.com',
          password: '',
        });
      expect(response.body.errors[0].msg).toBe('Invalid value');
      expect(response.body.errors[0].param).toBe('password');
    });
  });
  describe('given an existing email and valid password', () => {
    it('should return a 200 status', async () => {
      const createUserServiceMock = jest
        .spyOn(UserService, 'findUser')
        // @ts-ignore
        .mockReturnValueOnce(
          Promise.resolve({
            username: 'testUser',
            email: 'testing@gmail.com',
            id: '62371c3c7110b650f4fce1b3',
          })
        );

      process.env.JWT_KEY = 'test';

      const response: any = await request(app)
        .post('/api/v1/users/login')
        .send({
          username: 'test',
          password: 'test',
          email: 'testing@gmail.com',
        });

      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        username: 'testUser',
        email: 'testing@gmail.com',
        id: '62371c3c7110b650f4fce1b3',
      });
      expect(createUserServiceMock).toHaveBeenCalledTimes(1);
    });
  });
});

describe('given an existing email but a wrong password', () => {
  it('should return a 409 status', async () => {
    jest
      .spyOn(UserService, 'findUser')
      // @ts-ignore
      .mockImplementation(() => {
        throw new Error('Error: Wrong credentials');
      });

    process.env.JWT_KEY = 'test';

    const response: any = await request(app).post('/api/v1/users/login').send({
      username: 'test',
      password: 'tet',
      email: 'testing@gmail.com',
    });

    expect(response.status).toEqual(409);
    expect(response.body.message).toBe('Error: Wrong credentials');
  });
});
