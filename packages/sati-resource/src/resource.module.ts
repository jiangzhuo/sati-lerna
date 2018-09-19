import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { configure as i18nConfigure } from 'i18n';

import { MindfulnessGrpcController } from './controllers/mindfulness.grpc.controller';
import { MindfulnessSchema } from './schemas/mindfulness.schema';
import { MindfulnessService } from './services/mindfulness.service';

import { NatureGrpcController } from './controllers/nature.grpc.controller';
import { NatureSchema } from './schemas/nature.schema';
import { NatureService } from './services/nature.service';

import { WanderGrpcController } from './controllers/wander.grpc.controller';
import { WanderSchema } from './schemas/wander.schema';
import { WanderService } from './services/wander.service';

import { WanderAlbumSchema } from './schemas/wanderAlbum.schema';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/module_resource'),
        MongooseModule.forFeature([{ name: 'Mindfulness', schema: MindfulnessSchema, collection: 'mindfulness' },
            { name: 'Nature', schema: NatureSchema, collection: 'nature' },
            { name: 'Wander', schema: WanderSchema, collection: 'wander' },
            { name: 'WanderAlbum', schema: WanderAlbumSchema, collection: 'wanderAlbum' },
        ])
    ],
    controllers: [
        MindfulnessGrpcController,
        NatureGrpcController,
        WanderGrpcController
    ],
    providers: [
        MindfulnessService,
        NatureService,
        WanderService
    ],
    exports: []
})
export class ResourceModule implements OnModuleInit {
    constructor(
        @Inject(MindfulnessService) private readonly mindfulnessService: MindfulnessService,
        @Inject(NatureService) private readonly natureService: NatureService,
        @Inject(WanderService) private readonly wanderService: WanderService,
        // @InjectRepository(User) private readonly userRepo: Repository<User>
    ) { }

    static forRoot(options: { i18n: 'en-US' | 'zh-CN' }): DynamicModule {
        i18nConfigure({
            locales: ['en-US', 'zh-CN'],
            defaultLocale: options.i18n,
            directory: 'src/i18n'
        });
        return {
            module: ResourceModule
        };
    }

    async onModuleInit() {
        // await this.createSuperAdmin();
    }

    // /**
    //  * Create a system super administrator
    //  */
    // private async createSuperAdmin() {
    //     const sadmin = await this.userRepo.findOne({ where: { username: 'sadmin' } });
    //     if (sadmin) return;
    //     await this.userService.createUser({ username: 'sadmin', password: 'sadmin' });
    // }
}