import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Role } from "src/enums/role.enum";

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
    @IsEnum(Role)
    role: number;
}
