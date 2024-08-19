import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {UserController} from './users/user.controller';
import {UserService} from './users/user.service';
import {User} from './users/user.entity';
import {QuestsController} from "./quests/quests.controller";
import {QuestsService} from "./quests/quests.service";
import {Quest} from "./quests/quests.entity";
import {Answer} from "./quests/answer.entity";
import {Question} from "./quests/question.entity";
import {Role} from "./users/role.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Quest, Answer, Question, Role],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Quest, Answer, Question, Role]),
  ],
  controllers: [UserController, QuestsController],
  providers: [UserService, QuestsService],
})
export class AppModule {
}
