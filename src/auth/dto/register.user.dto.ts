import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { LoginUserDto } from './login.user.dto';

export class RegisterUserDto extends PartialType(LoginUserDto) {
	@IsString()
	@MinLength(3)
	@MaxLength(255)
	name: string;

	@IsString()
	@MinLength(3)
	@MaxLength(255)
	lastname: string;

	@IsEmail()
	@MaxLength(255)
	email: string;

	@IsString()
	@MinLength(8)
	@MaxLength(255)
	password: string;
}
