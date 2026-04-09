import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import {UsersModule} from "./entities/user/users.module";
import {FeedbackModule} from "./entities/feedback/feedback.module";
import {StatsModule} from "./entities/stats/stats.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        DatabaseModule,
        UsersModule,
        AuthModule,
        FeedbackModule,
        StatsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}