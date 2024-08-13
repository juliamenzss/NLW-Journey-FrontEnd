import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {    
    const existingUser = await this.userModel.findOne({email: data.email}).exec();
    if (existingUser){
      throw new BadRequestException('Email already in use aqui')
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt)
    const createdUser = new this.userModel({...data, password: hashedPassword});
    return createdUser.save();
  }

  async createUser(
    registerDto: AuthRegisterDto, hashedPassword: string): Promise<User> {
    const newUser = new this.userModel({ ...registerDto, password: hashedPassword});
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    try {
      return this.userModel.find().exec();
    } catch (error) {
      throw new NotFoundException('User not found', error);
    }
  }

  async findOne(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!user) throw new NotFoundException('User not found');

    if(updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt)
    }
    Object.assign(user, updateUserDto);
    await user.save();
    return user;
  }

  async updatePassword(email: string, newPassword: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await this.userModel.findOneAndUpdate({email}, {password: hashedPassword}, {new: true});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('Usuário após atualização de senha:', user);
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
