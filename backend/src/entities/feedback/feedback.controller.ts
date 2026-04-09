import { Controller, Post, Body, Get, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

import { Feedback } from './feedback.model';
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
    constructor(private feedbackService: FeedbackService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Создать новый отзыв' })
    @ApiBody({ type: CreateFeedbackDto })
    @ApiResponse({
        status: 201,
        description: 'Отзыв успешно создан',
        schema: {
            example: {
                success: true,
                message: 'Отзыв успешно сохранен',
                feedback: {
                    id: 1,
                    userId: 1,
                    question1: 5,
                    question2: 4,
                    question3: 5,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Невалидные данные' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async create(@Body() createFeedbackDto: CreateFeedbackDto) {
        return this.feedbackService.create(createFeedbackDto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить все отзывы' })
    @ApiResponse({
        status: 200,
        description: 'Список всех отзывов',
        type: [Feedback]
    })
    async findAll() {
        return this.feedbackService.findAll();
    }

    @Get('statistics')
    @ApiOperation({ summary: 'Получить статистику по всем отзывам' })
    @ApiResponse({
        status: 200,
        description: 'Статистика по отзывам',
        schema: {
            example: {
                total: 10,
                averageRatings: {
                    question1: 4.5,
                    question2: 4.2,
                    question3: 4.8
                },
                overallAverage: 4.5
            }
        }
    })
    async getStatistics() {
        return this.feedbackService.getStatistics();
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Получить отзывы конкретного пользователя' })
    @ApiParam({ name: 'userId', description: 'ID пользователя', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Список отзывов пользователя',
        type: [Feedback]
    })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async findByUserId(@Param('userId') userId: string) {
        return this.feedbackService.findByUserId(Number(userId));
    }
}