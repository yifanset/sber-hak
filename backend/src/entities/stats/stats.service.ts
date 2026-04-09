import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Stats } from './stats.model';
import { User } from '../user/user.model';
import { CreateStatsDto } from './dto/create-stats.dto';

@Injectable()
export class StatsService {
    constructor(
        @InjectModel(Stats)
        private statsModel: typeof Stats,
        @InjectModel(User)
        private userModel: typeof User,
    ) {}

    async create(createStatsDto: CreateStatsDto): Promise<{ success: boolean; message: string; stats?: Stats }> {
        const { userId, question1, question2, question3 } = createStatsDto;

        // Проверяем существование пользователя
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        // Валидация значений
        if (!this.isValidRating(question1) || !this.isValidRating(question2) || !this.isValidRating(question3)) {
            throw new BadRequestException('Значения должны быть от 1 до 5');
        }

        const stats = await this.statsModel.create({
            userId,
            question1,
            question2,
            question3,
        });

        return {
            success: true,
            message: 'Статистика успешно сохранена',
            stats,
        };
    }

    async findAll(): Promise<Stats[]> {
        return this.statsModel.findAll({
            include: [
                {
                    model: User,
                    attributes: ['userId', 'login', 'name', 'city'], // Исключаем пароль
                },
            ],
            order: [['createdAt', 'DESC']], // Сортировка по дате создания (новые сначала)
        });
    }

    async findByUserId(userId: number): Promise<Stats[]> {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return this.statsModel.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['userId', 'login', 'name', 'city'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
    }

    async getStatistics(): Promise<any> {
        const allStats = await this.statsModel.findAll();

        if (allStats.length === 0) {
            return {
                total: 0,
                averageValues: {
                    question1: 0,
                    question2: 0,
                    question3: 0,
                },
                overallAverage: 0,
            };
        }

        const stats = allStats.reduce((acc, stat) => {
            acc.question1 += stat.question1;
            acc.question2 += stat.question2;
            acc.question3 += stat.question3;
            return acc;
        }, { question1: 0, question2: 0, question3: 0 });

        const total = allStats.length;
        const avgQuestion1 = stats.question1 / total;
        const avgQuestion2 = stats.question2 / total;
        const avgQuestion3 = stats.question3 / total;
        const overallAverage = (avgQuestion1 + avgQuestion2 + avgQuestion3) / 3;

        return {
            total,
            averageValues: {
                question1: Number(avgQuestion1.toFixed(2)),
                question2: Number(avgQuestion2.toFixed(2)),
                question3: Number(avgQuestion3.toFixed(2)),
            },
            overallAverage: Number(overallAverage.toFixed(2)),
        };
    }

    private isValidRating(value: number): boolean {
        return Number.isInteger(value) && value >= 1 && value <= 5;
    }
}