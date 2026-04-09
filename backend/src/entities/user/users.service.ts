import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) {}

    async findByLogin(login: string): Promise<User | null> {
        return this.userModel.findOne({ where: { login } });
    }

    async findById(userId: number): Promise<User | null> {
        return this.userModel.findByPk(userId);
    }

    async create(userData: {
        login: string;
        password: string;
        name?: string;
        city?: string;
    }): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        return this.userModel.create({
            ...userData,
            password: hashedPassword,
        });
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async updateMoney(userId: number, money: number): Promise<{ success: boolean; message: string; money?: number }> {
        const user = await this.findById(userId);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        user.money = money;
        await user.save();

        return {
            success: true,
            message: 'Баланс успешно обновлен',
            money: user.money,
        };
    }

    async updateBonus(userId: number, bonus: number): Promise<{ success: boolean; message: string; bonus?: number }> {
        const user = await this.findById(userId);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        user.bonus = bonus;
        await user.save();

        return {
            success: true,
            message: 'Баллы успешно обновлены',
            bonus: user.bonus,
        };
    }

    async addMoney(userId: number, amount: number): Promise<{ success: boolean; message: string; money?: number }> {
        const user = await this.findById(userId);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        user.money = Number(user.money) + amount;
        await user.save();

        return {
            success: true,
            message: 'Баланс успешно пополнен',
            money: user.money,
        };
    }

    async addBonus(userId: number, amount: number): Promise<{ success: boolean; message: string; bonus?: number }> {
        const user = await this.findById(userId);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        user.bonus = Number(user.bonus) + amount;
        await user.save();

        return {
            success: true,
            message: 'Баллы успешно начислены',
            bonus: user.bonus,
        };
    }
}