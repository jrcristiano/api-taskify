import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { HttpStatusCode } from 'src/common/enums/http.status.code.enum';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatusCode.Created)
	register(@Body() registerUserDto: RegisterUserDto) {
		return this.authService.register(registerUserDto);
	}

	@Post('login')
	@HttpCode(HttpStatusCode.OK)
	login(@Body() registerUserDto: LoginUserDto) {
		return this.authService.login(registerUserDto);
	}
}
