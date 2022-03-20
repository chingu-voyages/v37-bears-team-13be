// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';

import { app } from '../../app';
import * as UserService from '../../service/user.service';

describe('signup', () => {
  describe('given an username with more than 20 characters', () => {
    it('should return an error', async () => {
      const response: any = await request(app)
        .post('/api/v1/users/signup')
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
        .post('/api/v1/users/signup')
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
        .post('/api/v1/users/signup')
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
        .post('/api/v1/users/signup')
        .send({
          username: 'test',
          email: '',
          password: 'test',
        });
      expect(response.body.errors[0].msg).toBe('Invalid value');
      expect(response.body.errors[0].param).toBe('email');
    });
  });
  describe('given an password with more than 20 characters', () => {
    it('should return an error', async () => {
      const response: any = await request(app)
        .post('/api/v1/users/signup')
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
        .post('/api/v1/users/signup')
        .send({
          username: 'test',
          email: 'test@gmail.com',
          password: '',
        });
      expect(response.body.errors[0].msg).toBe('Invalid value');
      expect(response.body.errors[0].param).toBe('password');
    });
  });
  describe('given an existing email', () => {
    it('should return a 409 status', async () => {
      const createUserServiceMock = jest
        .spyOn(UserService, 'findUser')
        // @ts-ignore
        .mockReturnValueOnce(
          Promise.resolve({
            id: '2134',
            username: 'test',
            email: 'testing@gmail.com',
          })
        );

      const response: any = await request(app)
        .post('/api/v1/users/signup')
        .send({
          username: 'test',
          email: 'testing@gmail.com',
          password: 'test',
        });

      expect(response.status).toEqual(409);
      expect(response.body.message).toBe('Email already in use');
      expect(createUserServiceMock).toHaveBeenCalledTimes(1);
    });
  });
});
