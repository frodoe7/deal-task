import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.schema'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
// import { ArticleController } from './controllers/article.controller'
// import { ArticleService } from './services/article.service'

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/blog', {
            autoIndex: false,
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class AppModule {}
