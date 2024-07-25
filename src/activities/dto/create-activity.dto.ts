import { IsNotEmpty, IsOptional, IsString } from "class-validator";
// import { ActivitiesStatus } from "../enum/activities-status.enum";

export class CreateActivityDto {
    
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsString()
    @IsOptional()
    status?: string;

}
