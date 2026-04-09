import { ApiProperty } from '@nestjs/swagger';

export class UpdateMoneyDto {
    @ApiProperty({ example: 1, description: 'ID пользователя' })
    userId: number;

    @ApiProperty({ example: 1000.50, description: 'Новая сумма денег' })
    money: number;
}