import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateUrlDto {
    @IsString()
    longUrl: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    alias?: string;
}