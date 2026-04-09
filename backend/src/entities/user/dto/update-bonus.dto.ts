import { ApiProperty } from '@nestjs/swagger';

export class UpdateBonusDto {
    @ApiProperty({ example: 1, description: 'ID пользователя' })
    userId: number;

    @ApiProperty({ example: 500.00, description: 'Новое количество бонусов' })
    bonus: number;
}