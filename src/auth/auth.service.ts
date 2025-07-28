import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.user.dto';
import { RegisterUserDto } from './dto/register.user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async register(registerUserDto: RegisterUserDto) {
		return await this.userService.createUserWithHashedPassword(registerUserDto);
	}

	async login(loginUserDto: LoginUserDto) {
		const user = await this.userService.findOneByEmail(loginUserDto.email);

		if (!user) {
			throw new UnauthorizedException('E-mail inválido.');
		}

		const isPasswordValid = await bcrypt.compare(
			loginUserDto.password,
			user.password,
		);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Senha incorreta.');
		}

		const payload = {
			sub: user.id,
			email: user.email,
		};

		return {
			access_token: this.jwtService.sign(payload),
			user: {
				id: user.id,
				name: user.name,
				lastname: user.lastname,
				email: user.email,
			},
		};
	}
}
