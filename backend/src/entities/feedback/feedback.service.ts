import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Feedback } from './feedback.model';
import { User } from '../user/user.model';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(Feedback)
        private feedbackModel: typeof Feedback,
        @InjectModel(User)
        private userModel: typeof User,
    ) {}

    async create(createFeedbackDto: CreateFeedbackDto): Promise<{ success: boolean; message: string; feedback?: Feedback }> {
        const { userId, question1, question2, question3 } = createFeedbackDto;

        // Проверяем существование пользователя
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        // Валидация значений
        if (!this.isValidRating(question1) || !this.isValidRating(question2) || !this.isValidRating(question3)) {
            throw new BadRequestException('Оценки должны быть от 1 до 5');
        }

        const feedback = await this.feedbackModel.create({
            userId,
            question1,
            question2,
            question3,
        });

        return {
            success: true,
            message: 'Отзыв успешно сохранен',
            feedback,
        };
    }

    async findAll(): Promise<Feedback[]> {
        return this.feedbackModel.findAll({
            include: [
                {
                    model: User,
                    attributes: ['userId', 'login', 'name', 'city'], // Исключаем пароль
                },
            ],
            order: [['createdAt', 'DESC']], // Сортировка по дате создания (новые сначала)
        });
    }

    async findByUserId(userId: number): Promise<Feedback[]> {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return this.feedbackModel.findAll({
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
        const allFeedbacks = await this.feedbackModel.findAll();

        if (allFeedbacks.length === 0) {
            return {
                total: 0,
                averageRatings: {
                    question1: 0,
                    question2: 0,
                    question3: 0,
                },
                overallAverage: 0,
            };
        }

        const stats = allFeedbacks.reduce((acc, feedback) => {
            acc.question1 += feedback.question1;
            acc.question2 += feedback.question2;
            acc.question3 += feedback.question3;
            return acc;
        }, { question1: 0, question2: 0, question3: 0 });

        const total = allFeedbacks.length;
        const avgQuestion1 = stats.question1 / total;
        const avgQuestion2 = stats.question2 / total;
        const avgQuestion3 = stats.question3 / total;
        const overallAverage = (avgQuestion1 + avgQuestion2 + avgQuestion3) / 3;

        return {
            total,
            averageRatings: {
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