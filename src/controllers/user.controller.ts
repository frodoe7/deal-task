import { Controller, Get, Body, Post, Param } from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'
import { UserService } from '../services/user.service'
import { User } from '../schemas/user.schema'
import { CreateNewUser, CreateNewUserSchema } from '../pipes/user.pipe'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/all')
    findAll(): Promise<User[]> {
        return this.userService.findAll()
    }

    @Get('/:id')
    findById(@Param('id') id: string): Promise<User> {
        return this.userService.findById(id)
    }

    @Post()
    @ApiBody({
        required: true,
        description: 'Create a new user',
        schema: CreateNewUserSchema,
    })
    create(@Body() body: CreateNewUser): Promise<User> {
        return this.userService.create(body)
    }
}
