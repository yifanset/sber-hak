import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Feedback } from '../feedback/feedback.model';
import { Stats } from '../stats/stats.model';

interface UserCreationAttributes {
    login: string;
    password: string;
    name?: string;
    city?: string;
    money?: number;
    bonus?: number;
    level?: number;
    contract?: boolean;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
    @ApiProperty({ example: 1, description: 'Уникальный идентификатор пользователя' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    declare userId: number;

    @ApiProperty({ example: 'user123', description: 'Логин пользователя' })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    declare login: string;

    @ApiProperty({ example: 'hashedPassword123', description: 'Хешированный пароль' })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя', required: false })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare name: string | null;

    @ApiProperty({ example: 'Москва', description: 'Город пользователя', required: false })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare city: string | null;

    @ApiProperty({ example: 1000.50, description: 'Баланс пользователя', default: 0 })
    @Column({
        type: DataType.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
    })
    declare money: number;

    @ApiProperty({ example: 500.00, description: 'Бонусные баллы', default: 0 })
    @Column({
        type: DataType.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
    })
    declare bonus: number;

    @ApiProperty({ example: 2, description: 'Уровень пользователя', default: 0 })
    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
        allowNull: false,
    })
    declare level: number;

    @ApiProperty({ example: false, description: 'Статус контракта', default: false })
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    })
    declare contract: boolean;

    @HasMany(() => Feedback)
    declare feedbacks: Feedback[];

    @HasMany(() => Stats)
    declare stats: Stats[];
}