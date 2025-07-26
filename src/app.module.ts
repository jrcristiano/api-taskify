import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		PrismaModule,
		AuthModule,
		CommonModule,
		UserModule,
		TaskModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
