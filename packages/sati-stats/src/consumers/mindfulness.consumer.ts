import {
  Catch,
  Controller,
  Get, Inject,
  OnModuleInit
} from '@nestjs/common';
import { InjectConsumer } from 'nestjs-ali-ons';
import { Consumer } from 'ali-ons';

@Catch()
@Controller('mindfulness')
export class MindfulnessConsumer {
  onModuleInit() {
    console.log('FavoriteConsumer init')
    this.consumer.subscribe(this.favoriteResource)
  }

  constructor(
    @InjectConsumer('sati_debug', 'mindfulness') private readonly consumer: Consumer,
  ) {
  }

  @Get()
  async helloWorld() {
    return 'I am OK!';
  }

  async favoriteResource(message) {
    console.log(message)
    // console.log(this.consumer)
    // this.consumer.subscribe(async msg => {
    //   console.log(msg)
    //   console.log(`receive message, msgId: ${msg.msgId}, body: ${msg.body.toString()}`)
    // });
  }
}
