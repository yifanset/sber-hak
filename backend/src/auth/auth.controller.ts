import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {RegisterDto} from "../entities/user/dto/create-user.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: 201,
        description: 'Пользователь успешно зарегистрирован',
        schema: {
            example: {
                success: true,
                message: 'Регистрация успешна',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Пользователь с таким логином уже существует' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Авторизация пользователя' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'Успешная авторизация',
        schema: {
            example: {
                success: true,
                message: 'Авторизация успешна',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Неверный логин или пароль' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}