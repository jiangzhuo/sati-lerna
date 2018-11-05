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
import { Mindfulness } from '../interfaces/mindfulness.interface';

@Catch()
@Controller('mindfulness')
export class MindfulnessConsumer {
    onModuleInit() {
        this.consumer.subscribe(this.handler.bind(this))
    }

    constructor(
        @InjectConsumer('sati_debug', 'mindfulness') private readonly consumer: Consumer,
        @InjectModel('Mindfulness') private readonly mindfulnessModel: Model<Mindfulness>
    ) {
    }

    @Get()
    async helloWorld() {
        return 'I am OK!';
    }

    async handler(message) {
        let body = JSON.parse(message.body.toString());
        switch (message.properties.KEYS) {
            case 'favorite':
                await this.mindfulnessModel.findOneAndUpdate({ _id: body.mindfulnessId }, { $inc: { "stats.favorite": 1 } }).exec();
                break;
            case 'buy':
                await this.mindfulnessModel.findOneAndUpdate({ _id: body.mindfulnessId }, { $inc: { "stats.buy": 1 } }).exec();
                break;
            case 'start':
                await this.mindfulnessModel.findOneAndUpdate({ _id: body.mindfulnessId }, { $inc: { "stats.start": 1 } }).exec();
                break;
            case 'finish':
                await this.mindfulnessModel.findOneAndUpdate({ _id: body.mindfulnessId },
                    { $inc: { "stats.finish": 1, "stats.duration": body.duration || 0 } }).exec();
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
