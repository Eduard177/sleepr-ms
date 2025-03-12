import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bycrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}
  async createUser(createUserDto: CreateUserDto) {
    return this.usersRepo.create({
      ...createUserDto,
      password: await bycrypt.hash(createUserDto.password, 10),
    });
  }

  async verifyUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepo.findOne({ email });
    const passwordIsValid = await bycrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepo.findOne(getUserDto);
  }
}
