import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
// import { AppResolver } from './app.resolver';
import { ErrorsInterceptor } from './common/interceptors';
import { GraphQLConfigService } from './graphql-config.service';
// import { NotaddGrpcClientFactory } from './grpc/grpc.client-factory';
import { UserModule } from './modules/user/user.module';
import { ResourceModule } from './modules/resource/resource.module';
import { StatsModule } from './modules/stats/stats.module';
import { UploadModule } from './modules/upload/upload.module';
import { DownloadModule } from './modules/download/download.module';
import { PurchaseModule } from './modules/purchase/purchase.module';


@Global()
@Module({
    imports: [
        GraphQLModule.forRootAsync({
            useClass: GraphQLConfigService
        }),
        UploadModule,
        DownloadModule,
        ResourceModule,
        StatsModule,
        UserModule,
        PurchaseModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorsInterceptor
        }
    ],
    exports: []
})
export class AppModule { }
