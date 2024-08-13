import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from 'src/file/file.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    FileModule,
    forwardRef(() => UsersModule),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7 days' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService], //todo serviço é um provider dentro do modulo
  exports: [AuthService]
})
export class AuthModule {}

