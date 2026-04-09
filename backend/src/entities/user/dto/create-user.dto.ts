import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'user123', description: 'Логин пользователя' })
    login: string;

    @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
    password: string;

    @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя', required: false })
    name?: string;

    @ApiProperty({ example: 'Москва', description: 'Город пользователя', required: false })
    city?: string;
}