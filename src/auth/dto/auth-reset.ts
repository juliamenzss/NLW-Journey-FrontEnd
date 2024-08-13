import { IsJWT, IsString, MinLength } from "class-validator";

export class AuthResetDto {

    @MinLength(6)
    @IsString()
    password: string;

    @IsJWT()
    token: string;
}