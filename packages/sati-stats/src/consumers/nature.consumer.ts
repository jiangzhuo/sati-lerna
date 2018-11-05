import {
    Catch,
    Controller,
    Get, Inject,
    OnModuleInit
} from '@nestjs/common';
import { InjectConsumer } from 'nestjs-ali-ons';
import { Consumer } from 'ali-ons';
import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Nature } from '../interfaces/nature.interface';

@Catch()
@Controller('nature')
export class NatureConsumer {
    onModuleInit() {
        this.consumer.subscribe(this.handler.bind(this))
    }

    constructor(
        @InjectConsumer('sati_debug', 'nature') private readonly consumer: Consumer,
        @InjectModel('Nature') private readonly natureModel: Model<Nature>
    ) {
    }

    @Get()
    async helloWorld() {
        return 'I am OK!';
    }

    async handler(message) {
        let body = JSON.parse(message.body.toString());
        console.log(body)
        switch (message.properties.KEYS) {
            case 'favorite':
                await this.natureModel.findOneAndUpdate({ _id: body.natureId }, { $inc: { favorite: 1 } }).exec();
                break;
            case 'buy':
                await this.natureModel.findOneAndUpdate({ _id: body.natureId }, { $inc: { buy: 1 } }).exec();
                break;
            case 'start':
                await this.natureModel.findOneAndUpdate({ _id: body.natureId }, { $inc: { start: 1 } }).exec();
                break;
            case 'finish':
                await this.natureModel.findOneAndUpdate({ _id: body.natureId },
                    { $inc: { finish: 1, duration: body.duration || 0 } }).exec();
                break;
            default:
                console.error('not handled action')
        }
        // console.log(message)
        // console.log(this.consumer)
        // this.consumer.subscribe(async msg => {
        //   console.log(msg)
        //   console.log(`receive message, msgId: ${msg.msgId}, body: ${msg.body.toString()}`)
        // });
    }
}
