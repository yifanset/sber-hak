import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationAttributes {
    login: string;
    password: string;
    name?: string;
    city?: string;
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
}