import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3000;

    app.enableCors();
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('Документация REST API для управления пользователями, фидбеком и статистикой')
        .setVersion('1.0')
        .addTag('Auth', 'Аутентификация и регистрация')
        .addTag('Users', 'Управление пользователями')
        .addTag('Feedback', 'Управление отзывами')
        .addTag('Stats', 'Управление статистикой')
        .build();

    // Cast to the expected type
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    await app.listen(port);
    console.log(`Сервер запущен на: http://localhost:${port}`);
    console.log(`Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();