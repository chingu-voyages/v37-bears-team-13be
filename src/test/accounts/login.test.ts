import request from 'supertest';

import { app } from '../../app';

describe('login', () => {
  describe('given an username with more than 20 characters', () => {
    it.only('should return an error', async () => {
      const response: any = await request(app)
        .post('/api/v1/users/login')
        .send({
          username:
            'adiosssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
          email: 'test@gmail.com',
          password: 'test',
        });
      expect(response.body.errors[0].msg).toBe('Invalid value');
    });
  });
  describe('given an username with no characters', () => {
    it('should return an error', () => {});
  });
  describe('given an email with more than 30 characters', () => {
    it('should return an error', () => {});
  });
  describe('given an email with no characters', () => {
    it('should return an error', () => {});
  });
  describe('given an password with more than 20 characters', () => {
    it('should return an error', () => {});
  });
  describe('given an password with no characters', () => {
    it('should return an error', () => {});
  });
  describe('given a non existing user', () => {
    it('should return a 409 status', () => {});
  });
  describe('given an invalid password', () => {
    it('should return a 409 status', () => {});
  });
});
describe('given an user with correct credentials', () => {
  it('should return 200', () => {});
});
