import { ApiProperty } from '@nestjs/swagger';

export class AddBonusDto {
    @ApiProperty({ example: 1, description: 'ID пользователя' })
    userId: number;

    @ApiProperty({ example: 50, description: 'Количество бонусов для начисления' })
    amount: number;
}