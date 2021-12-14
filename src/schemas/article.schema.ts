import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { User } from './user.schema'

export type ArticleDocument = Article & Document

interface Comment {
    content: string
    user: mongoose.Schema.Types.ObjectId
}

@Schema()
export class Article {
    @Prop({
        type: String,
        required: true,
    })
    title: string

    @Prop({
        type: String,
        required: true,
    })
    body: string

    @Prop({
        type: String,
        required: true,
        ref: 'User',
    })
    user: User

    @Prop({
        type: Number,
        default: 0,
    })
    thumbs: number

    @Prop()
    comments: Comment[]
}

export const ArticleSchema = SchemaFactory.createForClass(Article)
