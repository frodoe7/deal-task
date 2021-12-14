import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Article, ArticleDocument } from '../schemas/article.schema'
import { CreateNewComment, CreateNewArticle } from '../pipes/article.pipe'

@Injectable()
export class ArticleService implements OnModuleInit {
    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>
    ) {}

    onModuleInit() {
        this.createIndexes()
    }

    // Create indexes
    async createIndexes() {
        await this.articleModel.collection.createIndex({
            title: 'text',
            body: 'text',
        })
    }

    async create(newArticle: CreateNewArticle): Promise<Article> {
        return this.articleModel.create(newArticle)
    }

    async findAll(): Promise<Article[]> {
        return this.articleModel.find({}).sort({ thumbs: 1 }).exec()
    }

    async findById(_id: string): Promise<Article> {
        return this.articleModel.findOne({ _id }).exec()
    }

    async thumpUp(_id: string): Promise<Article> {
        return this.articleModel
            .findOneAndUpdate({ _id }, { $inc: { thumbs: 1 } }, { new: true })
            .exec()
    }

    async addComment(_id: string, comment: CreateNewComment): Promise<Article> {
        return this.articleModel
            .findOneAndUpdate(
                { _id },
                { $push: { comments: comment } },
                { new: true }
            )
            .exec()
    }

    async search(text: string): Promise<Article[]> {
        return this.articleModel
            .find(
                { $text: { $search: text } },
                { score: { $meta: 'textScore' } }
            )
            .sort({ score: { $meta: 'textScore' } })
            .lean()
            .exec()
    }

    // Only for testing purpose
    async clearArticles() {
        await this.articleModel.deleteMany({})
    }
}
