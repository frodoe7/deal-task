import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { CreateNewUser } from '../pipes/user.pipe'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async create(newUser: CreateNewUser): Promise<User> {
        return this.userModel.create(newUser)
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find({ isAuthor: true }).exec()
    }

    async findById(_id: string, onlyAuthors = true): Promise<User> {
        return onlyAuthors
            ? this.userModel.findOne({ isAuthor: true, _id }).exec()
            : this.userModel.findOne({ _id }).exec()
    }

    // Only for testing purpose
    async clearUsers() {
        await this.userModel.deleteMany({})
    }
}
