import { ApiProperty } from '@nestjs/swagger';

export class CreateStatsDto {
    @ApiProperty({ example: 1, description: 'ID пользователя' })
    userId: number;

    @ApiProperty({ example: 5, description: 'Значение по первому показателю (1-5)', minimum: 1, maximum: 5 })
    question1: number;

    @ApiProperty({ example: 4, description: 'Значение по второму показателю (1-5)', minimum: 1, maximum: 5 })
    question2: number;

    @ApiProperty({ example: 5, description: 'Значение по третьему показателю (1-5)', minimum: 1, maximum: 5 })
    question3: number;
}