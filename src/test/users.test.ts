import supertest from 'supertest';

import { app } from '../app';
import * as UserService from '../service/user.service';

describe('users', () => {
  describe('Get /users', () => {
    it('should return an array with users', async () => {
      jest
        .spyOn(UserService, 'findAllUsers')
        .mockReturnValueOnce(Promise.resolve([]));
      const { body, status } = await supertest(app).get('/api/v1/users');
      expect(body).toHaveProperty('users', expect.any(Array));
      expect(status).toEqual(200);
    });
  });
});
