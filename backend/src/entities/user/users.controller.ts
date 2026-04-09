import {Controller, Post, Body, UseGuards, Param, Get} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateMoneyDto } from './dto/update-money.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { AddMoneyDto } from './dto/add-money.dto';
import { AddBonusDto } from './dto/add-bonus.dto';
import { SignContractDto } from './dto/sign-contract.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(':userId')
    @ApiOperation({ summary: 'Получить полную информацию о пользователе по ID' })
    @ApiParam({ name: 'userId', description: 'ID пользователя', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Информация о пользователе',
        schema: {
            example: {
                success: true,
                user: {
                    userId: 1,
                    login: 'user123',
                    name: 'Иван Иванов',
                    city: 'Москва',
                    money: 1000.50,
                    bonus: 500,
                    level: 2,
                    contract: true,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    feedbacks: [
                        {
                            id: 1,
                            question1: 5,
                            question2: 4,
                            question3: 5,
                            createdAt: '2024-01-01T00:00:00.000Z'
                        }
                    ],
                    stats: [
                        {
                            id: 1,
                            question1: 5,
                            question2: 4,
                            question3: 5,
                            createdAt: '2024-01-01T00:00:00.000Z'
                        }
                    ]
                }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async getUserInfo(@Param('userId') userId: string) {
        return this.usersService.getUserInfo(Number(userId));
    }

    @UseGuards(JwtAuthGuard)
    @Post('money')
    @ApiOperation({ summary: 'Установить точную сумму денег' })
    @ApiBody({ type: UpdateMoneyDto })
    @ApiResponse({
        status: 200,
        description: 'Баланс успешно обновлен',
        schema: {
            example: {
                success: true,
                message: 'Баланс успешно обновлен',
                money: 1000.50
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })


    @UseGuards(JwtAuthGuard)
    @Post('money')
    @ApiOperation({ summary: 'Установить точную сумму денег' })
    @ApiBody({ type: UpdateMoneyDto })
    @ApiResponse({
        status: 200,
        description: 'Баланс успешно обновлен',
        schema: {
            example: {
                success: true,
                message: 'Баланс успешно обновлен',
                money: 1000.50
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })

    async updateMoney(@Body() updateMoneyDto: UpdateMoneyDto) {
        return this.usersService.updateMoney(updateMoneyDto.userId, updateMoneyDto.money);
    }

    @UseGuards(JwtAuthGuard)
    @Post('bonus')
    @ApiOperation({ summary: 'Установить точное количество бонусов' })
    @ApiBody({ type: UpdateBonusDto })
    @ApiResponse({
        status: 200,
        description: 'Баллы успешно обновлены',
        schema: {
            example: {
                success: true,
                message: 'Баллы успешно обновлены',
                bonus: 500
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async updateBonus(@Body() updateBonusDto: UpdateBonusDto) {
        return this.usersService.updateBonus(updateBonusDto.userId, updateBonusDto.bonus);
    }

    @UseGuards(JwtAuthGuard)
    @Post('money/add')
    @ApiOperation({ summary: 'Пополнить баланс' })
    @ApiBody({ type: AddMoneyDto })
    @ApiResponse({
        status: 200,
        description: 'Баланс успешно пополнен',
        schema: {
            example: {
                success: true,
                message: 'Баланс успешно пополнен',
                money: 1100.50
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async addMoney(@Body() addMoneyDto: AddMoneyDto) {
        return this.usersService.addMoney(addMoneyDto.userId, addMoneyDto.amount);
    }

    @UseGuards(JwtAuthGuard)
    @Post('bonus/add')
    @ApiOperation({ summary: 'Начислить бонусы' })
    @ApiBody({ type: AddBonusDto })
    @ApiResponse({
        status: 200,
        description: 'Баллы успешно начислены',
        schema: {
            example: {
                success: true,
                message: 'Баллы успешно начислены',
                bonus: 550
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async addBonus(@Body() addBonusDto: AddBonusDto) {
        return this.usersService.addBonus(addBonusDto.userId, addBonusDto.amount);
    }

    @UseGuards(JwtAuthGuard)
    @Post('contract/sign')
    @ApiOperation({ summary: 'Подписать контракт и повысить уровень' })
    @ApiBody({ type: SignContractDto })
    @ApiResponse({
        status: 200,
        description: 'Контракт успешно подписан',
        schema: {
            example: {
                success: true,
                message: 'Контракт успешно подписан, уровень повышен',
                level: 2
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Контракт уже подписан' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async signContract(@Body() signContractDto: SignContractDto) {
        return this.usersService.signContract(signContractDto.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('level')
    @ApiOperation({ summary: 'Изменить уровень пользователя' })
    @ApiBody({ type: UpdateLevelDto })
    @ApiResponse({
        status: 200,
        description: 'Уровень успешно изменен',
        schema: {
            example: {
                success: true,
                message: 'Уровень повышен',
                level: 2
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Достигнут максимальный уровень' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async updateLevel(@Body() updateLevelDto: UpdateLevelDto) {
        return this.usersService.updateLevel(updateLevelDto.userId, updateLevelDto.levelup);
    }
}