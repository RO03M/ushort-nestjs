import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUrlDto {
    @IsString()
    alias: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    newAlias?: string;

    @IsOptional()
    @IsString()
    newLongUrl?: string;
}