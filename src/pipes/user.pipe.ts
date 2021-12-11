import { IsString, MinLength, MaxLength, IsBoolean } from 'class-validator'

export class CreateNewUser {
    @IsString()
    @MinLength(2)
    @MaxLength(40)
    name: string

    @IsString()
    @MinLength(2)
    @MaxLength(40)
    job: string

    @IsBoolean()
    isAuthor?

    @IsString()
    _id?
}

export const CreateNewUserSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 2,
            maxLength: 40,
        },
        age: {
            type: 'string',
            minLength: 2,
            maxLength: 40,
        },

        isAuthor: {
            type: 'boolean',
        },
    },
}
