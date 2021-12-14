import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { UserController } from '../controllers/user.controller'
import { CreateNewUser } from '../pipes/user.pipe'
import { UserService } from '../services/user.service'
import { User, UserSchema } from '../schemas/user.schema'

describe('User Controller', () => {
    let controller: UserController
    let service: UserService

    const createUser: CreateNewUser = {
        name: 'Hany Shaker',
        job: 'Singer',
    }

    const createAuthor: CreateNewUser = {
        name: 'Ahmed Mohsen',
        job: 'Software engineer',
        isAuthor: true,
    }

    afterEach(async () => {
        await service.clearUsers()
    })

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
            imports: [
                MongooseModule.forRoot(process.env.DB_TEST_CONNECTION_STRING),
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                ]),
            ],
        }).compile()

        controller = module.get<UserController>(UserController)
        service = module.get<UserService>(UserService)
    })
    it('should return an empty array of authors', async () => {
        const allUsers = await controller.findAll()
        expect(allUsers).toEqual([])
    })

    it('should create a user with a false authority', async () => {
        const createdUser = await controller.create(createUser)
        expect(createdUser).toMatchObject({
            isAuthor: false,
        })
    })

    it('findAll must return authors only', async () => {
        await controller.create(createUser)
        await controller.create(createAuthor)
        const allUsers = await controller.findAll()
        allUsers.forEach((user) => {
            expect(user.isAuthor).toBe(true)
        })
    })

    it('should get author info by its id', async () => {
        const createdUser = await controller.create(createAuthor)
        const user = await controller.findById(
            (createdUser as any)._id.toString()
        )

        expect((createdUser as any)._id.toString()).toBe(
            (user as any)._id.toString()
        )
        expect(user).toMatchObject(createAuthor)
    })

    it('should not get author info if the user is not author', async () => {
        const createdUser = await controller.create(createUser)
        const user = await controller.findById(
            (createdUser as any)._id.toString()
        )
        expect(user).toBeNull()
    })
})
