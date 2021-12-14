import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.schema'
import { Article, ArticleSchema } from './schemas/article.schema'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { ArticleController } from './controllers/article.controller'
import { ArticleService } from './services/article.service'

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_CONNECTION_STRING),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([
            { name: Article.name, schema: ArticleSchema },
        ]),
    ],
    controllers: [UserController, ArticleController],
    providers: [UserService, ArticleService],
})
export class AppModule {}
