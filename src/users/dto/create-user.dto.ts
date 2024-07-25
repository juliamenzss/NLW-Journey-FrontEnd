import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {

    @Length(3, 50)
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(6)
    @IsString()
    password: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth: string;

}
