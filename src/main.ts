import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { NotFoundMiddleware } from './common/middlewares/not.found.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);



	const config = new DocumentBuilder()
		.setTitle('Task API')
		.setDescription('The tasks API description')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document);

	app.use(new NotFoundMiddleware().use);

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
	console.error('Failed to start application:', err);
	process.exit(1);
});
