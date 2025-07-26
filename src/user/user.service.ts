import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/auth/dto/register.user.dto';
import { HttpStatusCode } from 'src/common/enums/http.status.code.enum';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async findOneByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}

	async createUserWithHashedPassword(
		data: RegisterUserDto,
	): Promise<Omit<User, 'password'>> {
		const registeredEmail = await this.prisma.user.findUnique({
			where: { email: data.email },
		});

		if (registeredEmail) {
			throw new ConflictException('E-mail already in use.');
		}

		const encryptedPassword = await bcrypt.hash(data.password, 10);

		const createdUser = await this.prisma.user.create({
			data: {
				...data,
				password: encryptedPassword,
			},
		});

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...userWithoutPassword } = createdUser;

		return {
			...userWithoutPassword,
		};
	}
}
