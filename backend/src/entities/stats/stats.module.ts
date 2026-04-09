import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {Stats} from "./stats.model";
import {User} from "../user/user.model";
import {UsersModule} from "../user/users.module";
import {StatsService} from "./stats.service";
import {StatsController} from "./stats.controller";

@Module({
    imports: [
        SequelizeModule.forFeature([Stats, User]),
        UsersModule,
    ],
    providers: [StatsService],
    controllers: [StatsController],
    exports: [StatsService],
})
export class StatsModule {}