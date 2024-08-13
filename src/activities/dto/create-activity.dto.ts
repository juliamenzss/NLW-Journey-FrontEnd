import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateActivityDto {
    
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    status?: string;

    @IsMongoId({ message: 'userID must be a valid MongoDB ObjectId' })
    userId: string;
}
