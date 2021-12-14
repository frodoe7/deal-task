import { Controller, Get, Body, Post, Param, Put } from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { UserService } from '../services/user.service'
import { ArticleService } from '../services/article.service'
import { Article } from '../schemas/article.schema'
import {
    CreateNewArticle,
    CreateNewArticleSchema,
    CreateNewComment,
    CreateNewCommentSchema,
} from '../pipes/article.pipe'

@ApiTags('article')
@Controller('article')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly userService: UserService
    ) {}
    @Get('/all')
    findAll(): Promise<Article[]> {
        return this.articleService.findAll()
    }

    @Get('/search/:text')
    search(@Param('text') text: string): Promise<Article[]> {
        return this.articleService.search(text)
    }

    @Get('/:id')
    findById(@Param('id') id: string): Promise<Article> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null
        return this.articleService.findById(id)
    }

    @Put('thump/:id')
    thumpUp(@Param('id') id: string): Promise<Article> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null
        return this.articleService.thumpUp(id)
    }

    @Post()
    @ApiBody({
        required: true,
        description: 'Create a new article',
        schema: CreateNewArticleSchema,
    })
    async create(@Body() body: CreateNewArticle): Promise<Article> {
        if (!body.user.match(/^[0-9a-fA-F]{24}$/)) return null
        const userExist = await this.userService.findById(body.user)
        if (userExist) {
            return this.articleService.create(body)
        }

        return null
    }

    @Put('/comment/:id')
    @ApiBody({
        required: true,
        description: 'Create a new comment',
        schema: CreateNewCommentSchema,
    })
    async addComment(
        @Param('id') id: string,
        @Body() body: CreateNewComment
    ): Promise<Article> {
        if (!body.user.match(/^[0-9a-fA-F]{24}$/)) return null
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null

        const userExist = await this.userService.findById(body.user, false)
        const articleExist = await this.articleService.findById(id)

        if (userExist && articleExist) {
            return this.articleService.addComment(id, {
                user: body.user,
                content: body.content,
            })
        }

        return null
    }
}
