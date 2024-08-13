import { BadRequestException, Body, Controller, ParseFilePipe, Post, UnauthorizedException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { AuthForgetDto } from "./dto/auth-forget";
import { AuthResetDto } from "./dto/auth-reset";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { AuthMeDto } from "./dto/auth-me";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorators";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {writeFile} from 'fs/promises';
import path, {join} from 'path';
import { FileService } from "src/file/file.service";


@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('register')
  async register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: AuthLoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      console.log('passando aqui', user);
      
      throw new UnauthorizedException('Invalid credentials')
    }
    return this.authService.login(dto);
  }

  @Post('forget')
  async forget(@Body() {email}: AuthForgetDto) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() {password, token}: AuthResetDto) {
    return this.authService.reset(password, token);
  }


  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user) {
    return {user};
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(@User() user, @UploadedFile(new ParseFilePipe({
    validators: [
      new FileTypeValidator({fileType: 'image/jpeg'}),
      new MaxFileSizeValidator({maxSize: 1024 * 50})
    ]
  })) photo: Express.Multer.File) {

    const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user._id}.png`);;

    try {
      await this.fileService.upload(photo, path);
    } catch (e) {
      throw new BadRequestException(e)
    }
    return {success: true};
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
    return files;
  }

  @UseInterceptors(FileFieldsInterceptor([{
    name: 'photo',
    maxCount: 1
  }, {
    name: 'documents',
    maxCount: 10
  }]))
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async uploadFilesField(@User() user, @UploadedFiles() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}) {
    return files ;
  }

}