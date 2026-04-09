import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
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

    async signContract(userId: number): Promise<{ success: boolean; message: string; level?: number }> {
        const user = await this.findById(userId);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        if (user.contract) {
            throw new BadRequestException('Контракт уже подписан');
        }

        user.contract = true;
        user.level = user.level + 1;
        await user.save();

        return {
            success: true,
            message: 'Контракт успешно подписан, уровень повышен',
            level: user.level,
        };
    }

    async updateLevel(userId: number, levelup: boolean): Promise<{ success: boolean; message: string; level?: number }> {
        const user = await this.findById(userId);
        const MAX_LEVEL = 3;

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        let newLevel: number;

        if (levelup) {
            newLevel = user.level + 1;

            if (newLevel > MAX_LEVEL) {
                throw new BadRequestException(`Достигнут максимальный уровень ${MAX_LEVEL}`);
            }
        } else {
            newLevel = 1;
        }

        user.level = newLevel;
        await user.save();

        return {
            success: true,
            message: levelup ? 'Уровень повышен' : 'Уровень сброшен до 1',
            level: user.level,
        };
    }
}