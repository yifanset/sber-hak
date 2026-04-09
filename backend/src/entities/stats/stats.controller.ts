import { Controller, Post, Body, Get, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { CreateStatsDto } from './dto/create-stats.dto';
import { Stats } from './stats.model';
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
    constructor(private statsService: StatsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Создать новую запись статистики' })
    @ApiBody({ type: CreateStatsDto })
    @ApiResponse({
        status: 201,
        description: 'Статистика успешно создана',
        schema: {
            example: {
                success: true,
                message: 'Статистика успешно сохранена',
                stats: {
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
    async create(@Body() createStatsDto: CreateStatsDto) {
        return this.statsService.create(createStatsDto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить всю статистику' })
    @ApiResponse({
        status: 200,
        description: 'Список всех записей статистики',
        type: [Stats]
    })
    async findAll() {
        return this.statsService.findAll();
    }

    @Get('statistics')
    @ApiOperation({ summary: 'Получить агрегированную статистику' })
    @ApiResponse({
        status: 200,
        description: 'Агрегированная статистика',
        schema: {
            example: {
                total: 10,
                averageValues: {
                    question1: 4.5,
                    question2: 4.2,
                    question3: 4.8
                },
                overallAverage: 4.5
            }
        }
    })
    async getStatistics() {
        return this.statsService.getStatistics();
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Получить статистику конкретного пользователя' })
    @ApiParam({ name: 'userId', description: 'ID пользователя', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Список записей статистики пользователя',
        type: [Stats]
    })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async findByUserId(@Param('userId') userId: string) {
        return this.statsService.findByUserId(Number(userId));
    }
}