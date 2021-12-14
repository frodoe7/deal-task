import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { ArticleController } from '../controllers/article.controller'
import { UserController } from '../controllers/user.controller'
import { CreateNewArticle, CreateNewComment } from '../pipes/article.pipe'
import { CreateNewUser } from '../pipes/user.pipe'
import { ArticleService } from '../services/article.service'
import { UserService } from '../services/user.service'
import { Article, ArticleSchema } from '../schemas/article.schema'
import { User, UserSchema } from '../schemas/user.schema'

describe('Article Controller', () => {
    let controller: ArticleController
    let service: ArticleService
    let userService: UserService
    let userController: UserController

    const createArticle: CreateNewArticle = {
        title: 'Ahmed is a software engineer',
        body: 'There is a quick steps to be a software engineer',
        user: '',
    }

    const createUser: CreateNewUser = {
        name: 'Hany Shaker',
        job: 'Singer',
    }

    const createAuthor: CreateNewUser = {
        name: 'Ahmed Mohsen',
        job: 'Software engineer',
        isAuthor: true,
    }
    const createComment: CreateNewComment = {
        content: 'This is a sample comment',
        user: '',
    }
    afterEach(async () => {
        await service.clearArticles()
        await userService.clearUsers()
    })

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ArticleController, UserController],
            providers: [ArticleService, UserService],
            imports: [
                MongooseModule.forRoot(process.env.DB_TEST_CONNECTION_STRING),
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                ]),
                MongooseModule.forFeature([
                    { name: Article.name, schema: ArticleSchema },
                ]),
            ],
        }).compile()

        controller = module.get<ArticleController>(ArticleController)
        service = module.get<ArticleService>(ArticleService)
        userController = module.get<UserController>(UserController)
        userService = module.get<UserService>(UserService)
    })
    it('should return an empty array of articles', async () => {
        const allArticles = await controller.findAll()
        expect(allArticles).toEqual([])
    })

    it('should return array of articles sorted by thumbs', async () => {
        const createdUser = await userController.create(createAuthor)
        const toBeCreatedArticle = Object.assign({}, createArticle as any)
        toBeCreatedArticle.user = (createdUser as any)._id.toString()
        toBeCreatedArticle.thumbs = 5
        await controller.create(toBeCreatedArticle)
        toBeCreatedArticle.thumbs = 3
        await controller.create(toBeCreatedArticle)
        toBeCreatedArticle.thumbs = 4
        await controller.create(toBeCreatedArticle)
        const allArticles = await controller.findAll()
        for (let i = 0; i < allArticles.length - 1; i++) {
            expect(
                allArticles[i].thumbs < allArticles[i + 1].thumbs
            ).toBeTruthy()
        }
    })

    it('should create an article if the user id is valid and is author', async () => {
        const createdUser = await userController.create(createAuthor)
        const toBeCreatedArticle = Object.assign({}, createArticle as any)
        toBeCreatedArticle.user = (createdUser as any)._id.toString()
        const createdArticle = await controller.create(toBeCreatedArticle)
        expect(createdArticle.title).toBe(createArticle.title)
        expect(createdArticle.body).toBe(createArticle.body)
        expect(createdArticle.user).toBe(toBeCreatedArticle.user)
    })

    it('should not create an article if the user id is invalid or not author', async () => {
        const createdUser = await userController.create(createUser)
        const toBeCreatedArticle = Object.assign({}, createArticle as any)
        toBeCreatedArticle.user = (createdUser as any)._id.toString()
        const createdArticle = await controller.create(toBeCreatedArticle)
        expect(createdArticle).toBeNull()
    })

    it('should get article info by its id', async () => {
        const createdUser = await userController.create(createAuthor)
        const toBeCreatedArticle = Object.assign({}, createArticle as any)
        toBeCreatedArticle.user = (createdUser as any)._id.toString()
        const createdArticle = await controller.create(toBeCreatedArticle)
        const article = await controller.findById(
            (createdArticle as any)._id.toString()
        )
        expect((createdArticle as any)._id.toString()).toBe(
            (article as any)._id.toString()
        )
        expect(createdArticle.title).toBe(article.title)
        expect(createdArticle.body).toBe(article.body)
        expect(createdArticle.user).toBe(article.user)
    })

    it('should return the updated article after thumping up', async () => {
        const createdUser = await userController.create(createAuthor)
        const toBeCreatedArticle = Object.assign({}, createArticle as any)
        toBeCreatedArticle.user = (createdUser as any)._id.toString()
        const createdArticle = await controller.create(toBeCreatedArticle)
        expect(createdArticle.thumbs).toBe(0)
        await controller.thumpUp((createdArticle as any)._id.toString())
        const article = await controller.findById(
            (createdArticle as any)._id.toString()
        )
        expect(article.thumbs).toBe(1)
    })

    it('should return the updated article after commenting', async () => {
        const createdUser = await userController.create(createAuthor)
        const toBeCreatedArticle = Object.assign({}, createArticle as any)
        toBeCreatedArticle.user = (createdUser as any)._id.toString()
        const createdArticle = await controller.create(toBeCreatedArticle)
        expect(createdArticle.comments.length).toBe(0)
        const toBeCreatedComment = Object.assign({}, createComment)
        toBeCreatedComment.user = (createdUser as any)._id.toString()
        const article = await controller.addComment(
            (createdArticle as any)._id.toString(),
            toBeCreatedComment
        )
        expect(article.comments.length).toBe(1)
        expect(article.comments[0].content).toBe(createComment.content)
    })

    it('should search in articles and return array of articles by text score', async () => {
        await service.createIndexes()
        const createdUser = await userController.create(createAuthor)
        const toBeCreatedArticle = Object.assign({}, createArticle as any)
        toBeCreatedArticle.user = (createdUser as any)._id.toString()
        await controller.create(toBeCreatedArticle)
        toBeCreatedArticle.title = 'Software courses'
        toBeCreatedArticle.body =
            'Take some courses to fit in the software career'
        await controller.create(toBeCreatedArticle)
        toBeCreatedArticle.title = 'How to succeed in your career'
        toBeCreatedArticle.body = 'Ahmed is a professional software engineer'
        await controller.create(toBeCreatedArticle)
        toBeCreatedArticle.title = 'Develop in a professional way'
        toBeCreatedArticle.body =
            'Some quick steps to be a professional software developer'
        await controller.create(toBeCreatedArticle)
        const allArticles = await controller.search('software')
        for (let i = 0; i < allArticles.length - 1; i++) {
            expect(
                (allArticles[i] as any).score >
                    (allArticles[i + 1] as any).score
            ).toBeTruthy()
        }
    })
})
