import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'teste',
      password: 'teste',
    },
    {
      userId: 2,
      username: 'bananauser',
      password: 'banana',
    },
  ];

  async findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }
}
