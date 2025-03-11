import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}
  createUser(createUserDto: CreateUserDto) {
    return this.usersRepo.create(createUserDto);
  }
}
