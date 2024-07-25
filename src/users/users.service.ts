import { BadRequestException, HttpCode, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
   // aqui é do tipo user que é a entidade que definimos
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>) {}

  create(dto: CreateUserDto) {
    const user = this.repository.create(dto);
    return this.repository.save(user);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: string) {
    const user = await this.repository.findOneBy({ id });
    if(!user) throw new NotFoundException('User not found');
    return this.repository.save(user);
  }

  //aqui preciso encontrar antes o id para atualizar
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.repository.findOneBy({ id });
    if(!user) throw new NotFoundException('User not found');
    this.repository.merge(user, dto);
    return this.repository.save(user);
  }
  async remove(id: string) {
    const user = await this.repository.findOneBy({ id });
    if(!user) throw new NotFoundException('User not found');
    return this.repository.remove(user);
  }
}
