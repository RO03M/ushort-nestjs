import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
	@IsString()
	public name: string;

	@IsString()
	@IsEmail()
	public email: string;

	@IsString()
	public username: string;

	@IsString()
	@MinLength(12)
	public password: string;
}
