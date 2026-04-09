import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Feedback } from './feedback.model';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { User } from '../user/user.model';
import { UsersModule } from '../user/users.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Feedback, User]),
        UsersModule,
    ],
    providers: [FeedbackService],
    controllers: [FeedbackController],
    exports: [FeedbackService],
})
export class FeedbackModule {}