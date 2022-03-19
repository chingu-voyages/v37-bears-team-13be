import request from 'supertest';

import { app } from '../../app';

type User = { username: string; password: string };

it('Post/ should return 200 if an user was correctly login', () => {
  const testUser: User = {
    username: 'testUser',
    password: 'test',
  };

  request(app).post('/api/v1/users/login').send(testUser).expect(200);
});

it('Post/ should return 401 given invalid credentials', () => {
  const testUsers: User[] = [
    {
      username: '',
      password: 'te',
    },
    {
      username: 'Mario',
      password: '',
    },
    {
      username: '',
      password: '',
    },
  ];

  // eslint-disable-next-line no-restricted-syntax
  for (const user of testUsers) {
    request(app).post('/api/v1/users/login').send(user).expect(401);
  }
});
