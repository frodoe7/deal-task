import { IsString, MinLength, MaxLength } from 'class-validator'

export class CreateNewArticle {
    @IsString()
    @MinLength(8)
    @MaxLength(80)
    title: string

    @IsString()
    @MinLength(8)
    @MaxLength(800)
    body: string

    @IsString()
    user
}

export class CreateNewComment {
    @IsString()
    @MinLength(8)
    @MaxLength(80)
    content: string

    @IsString()
    user
}

export const CreateNewArticleSchema = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
            minLength: 8,
            maxLength: 80,
        },
        body: {
            type: 'string',
            minLength: 8,
            maxLength: 800,
        },

        user: {
            type: 'string',
        },
    },
}

export const CreateNewCommentSchema = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
            minLength: 8,
            maxLength: 80,
        },
        body: {
            type: 'string',
            minLength: 8,
            maxLength: 800,
        },

        user: {
            type: 'string',
        },
    },
}
