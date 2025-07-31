import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
	@IsString()
	@MaxLength(255)
	public name: string;

	@IsString()
	@IsEmail()
	@MaxLength(255)
	public email: string;

	@IsString()
	@MinLength(12)
	@MaxLength(255)
	public password: string;
}
