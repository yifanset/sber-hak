import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../entities/user/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from "../entities/user/user.model";
import { RegisterDto } from "../entities/user/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findByLogin(registerDto.login);

        if (existingUser) {
            return {
                success: false,
                message: 'Пользователь с таким логином уже существует',
            };
        }

        const user = await this.usersService.create(registerDto);

        const token = this.generateToken(user);

        return {
            success: true,
            message: 'Регистрация успешна',
            token,
            userId: user.userId,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByLogin(loginDto.login);

        if (!user) {
            return {
                success: false,
                message: 'Неверный логин или пароль',
            };
        }

        const isPasswordValid = await this.usersService.validatePassword(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            return {
                success: false,
                message: 'Неверный логин или пароль',
            };
        }

        const token = this.generateToken(user);

        return {
            success: true,
            message: 'Авторизация успешна',
            token,
            userId: user.userId,
        };
    }

    private generateToken(user: User) {
        const payload = { sub: user.userId, login: user.login };
        return this.jwtService.sign(payload);
    }
}