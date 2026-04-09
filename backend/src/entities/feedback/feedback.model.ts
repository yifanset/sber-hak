import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.model';

interface FeedbackCreationAttributes {
    userId: number;
    question1: number;
    question2: number;
    question3: number;
}

@Table({ tableName: 'feedbacks' })
export class Feedback extends Model<Feedback, FeedbackCreationAttributes> {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор отзыва' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @ApiProperty({ example: 1, description: 'ID пользователя' })
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare userId: number;

    @ApiProperty({ example: 5, description: 'Оценка по первому вопросу (1-5)', minimum: 1, maximum: 5 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    })
    declare question1: number;

    @ApiProperty({ example: 4, description: 'Оценка по второму вопросу (1-5)', minimum: 1, maximum: 5 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    })
    declare question2: number;

    @ApiProperty({ example: 5, description: 'Оценка по третьему вопросу (1-5)', minimum: 1, maximum: 5 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    })
    declare question3: number;

    @ApiProperty({ type: () => User, description: 'Пользователь, оставивший отзыв' })
    @BelongsTo(() => User)
    declare user: User;
}