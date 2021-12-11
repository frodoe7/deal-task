import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { TransformationInterceptor } from './interceptors'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const config = new DocumentBuilder()
        .setTitle('Blog example')
        .setDescription('Use ')
        .setVersion('1.0')
        .addTag('user')
        .addTag('article')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    app.useGlobalInterceptors(new TransformationInterceptor())
    app.useGlobalPipes(new ValidationPipe())

    await app.listen(3000)
}

bootstrap()
