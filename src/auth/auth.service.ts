import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from 'src/users/schemas/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { link } from 'fs';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailer: MailerService
  ) {}

  async createToken(user: User): Promise<{ accessToken: string }> {
    const accessToken = this.jwtService.sign({
      sub: user._id,
      name: user.name,
      email: user.email,
    }, {

      issuer: 'login',
      audience: 'users'
    });
    return { accessToken }
  }

   isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  checkToken(token: string) {
    try {
      const data =  this.jwtService.verify(token, {
        audience: 'users',
        issuer: 'login',
      });
      return data;
    } catch (e) {
      throw new BadRequestException(e)
    }
  }
  
  async register(registerDto: AuthRegisterDto): Promise<{ accessToken: string }> {
    const existingUser = await this.usersService.findOne(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);
 
    const newUser = await this.usersService.createUser(
      registerDto,
      hashedPassword,
    );
    return this.createToken(newUser);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
  
    if (!user) {
      console.log('Usuário não encontrado');
      return null;
    }
  
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    console.log('Senha fornecida:', password);
    console.log('Hash armazenado:', user.password);
    console.log('Senha corresponde:', isPasswordMatching);
  
    if (!isPasswordMatching) {
      console.log('Senha não corresponde');
      return null;
    }
  
    const { password: userPassword, ...result } = user.toObject();
    return result;
  }
  

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload)
    }
  }

  async forget(email: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Incorrect email');
    }

    const token = this.jwtService.sign({
      email: user.email
    }, {
      expiresIn: '30 minutes',
      issuer: 'forget',
      audience: 'users'
    });

    await this.mailer.sendMail({
      subject: 'Recuperação de Senha',
      to: 'vitoria2@test.com',
      template: 'forget',
      context: {
        name: user.name,
        token
      }

    });

    return true;
  }

  async reset(password: string, token: string): Promise<{ accessToken: string }> {
    let email: string;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
          issuer: 'forget',
          audience: 'users'
      });
      email = payload.email;
      if (!email) {
        throw new Error('Email not found in token payload');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Nova senha criptografada:', hashedPassword)

    const user = await this.usersService.updatePassword(email, hashedPassword);

    if (!user) {
      throw new UnauthorizedException('User not found after password reset');
    }
  
    return this.createToken(user);
  }
}
