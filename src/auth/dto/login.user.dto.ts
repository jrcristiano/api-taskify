import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
	@IsEmail()
	@MaxLength(255)
	email: string;

	@IsString()
	@MinLength(8)
	@MaxLength(255)
	password: string;
}
