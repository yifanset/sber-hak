import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationAttributes {
    login: string;
    password: string;
    name?: string;
    city?: string;
    money?: number;
    bonus?: number;
    level?: number;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    declare userId: number;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    declare login: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare name: string | null;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare city: string | null;

    @Column({
        type: DataType.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
    })
    declare money: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
    })
    declare bonus: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
        allowNull: false,
    })
    declare level: number;
}