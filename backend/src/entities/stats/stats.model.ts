import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.model';

interface StatsCreationAttributes {
    userId: number;
    question1: number;
    question2: number;
    question3: number;
}

@Table({ tableName: 'stats' })
export class Stats extends Model<Stats, StatsCreationAttributes> {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор записи статистики' })
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

    @ApiProperty({ example: 5, description: 'Значение по первому показателю (1-5)', minimum: 1, maximum: 5 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    })
    declare question1: number;

    @ApiProperty({ example: 4, description: 'Значение по второму показателю (1-5)', minimum: 1, maximum: 5 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    })
    declare question2: number;

    @ApiProperty({ example: 5, description: 'Значение по третьему показателю (1-5)', minimum: 1, maximum: 5 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    })
    declare question3: number;

    @ApiProperty({ type: () => User, description: 'Пользователь, которому принадлежит статистика' })
    @BelongsTo(() => User)
    declare user: User;
}