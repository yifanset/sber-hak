import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
    @ApiProperty({ example: 1, description: 'ID пользователя' })
    userId: number;

    @ApiProperty({ example: 5, description: 'Оценка по первому вопросу (1-5)', minimum: 1, maximum: 5 })
    question1: number;

    @ApiProperty({ example: 4, description: 'Оценка по второму вопросу (1-5)', minimum: 1, maximum: 5 })
    question2: number;

    @ApiProperty({ example: 5, description: 'Оценка по третьему вопросу (1-5)', minimum: 1, maximum: 5 })
    question3: number;
}