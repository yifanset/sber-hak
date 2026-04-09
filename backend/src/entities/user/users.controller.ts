import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateMoneyDto } from './dto/update-money.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { AddMoneyDto } from './dto/add-money.dto';
import { AddBonusDto } from './dto/add-bonus.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Post('money')
    async updateMoney(@Body() updateMoneyDto: UpdateMoneyDto) {
        return this.usersService.updateMoney(updateMoneyDto.userId, updateMoneyDto.money);
    }

    @UseGuards(JwtAuthGuard)
    @Post('bonus')
    async updateBonus(@Body() updateBonusDto: UpdateBonusDto) {
        return this.usersService.updateBonus(updateBonusDto.userId, updateBonusDto.bonus);
    }

    @UseGuards(JwtAuthGuard)
    @Post('money/add')
    async addMoney(@Body() addMoneyDto: AddMoneyDto) {
        return this.usersService.addMoney(addMoneyDto.userId, addMoneyDto.amount);
    }

    @UseGuards(JwtAuthGuard)
    @Post('bonus/add')
    async addBonus(@Body() addBonusDto: AddBonusDto) {
        return this.usersService.addBonus(addBonusDto.userId, addBonusDto.amount);
    }
}