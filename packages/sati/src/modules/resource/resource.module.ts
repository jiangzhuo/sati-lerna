import 'reflect-metadata';

import { DynamicModule, Global, UseGuards, Inject, Module, OnModuleInit } from '@nestjs/common';
// import { PATH_METADATA } from '@nestjs/common/constants';
import { APP_GUARD } from '@nestjs/core';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
// import { RESOLVER_TYPE_METADATA } from '@nestjs/graphql/dist/graphql.constants';
import { __ as t, configure as i18nConfigure } from 'i18n';

// import { PERMISSION_DEFINITION, RESOURCE_DEFINITION } from '../../common/decorators';
// import { Permission, Resource } from '../../common/interfaces';
import { NotaddGrpcClientFactory } from '../../grpc/grpc.client-factory';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { ResourceResolver } from './resolvers/resource.resolver';

// @Global()
@UseGuards(AuthGuard)
@Module({
    providers: [
        NotaddGrpcClientFactory,
        AuthService,
        ResourceResolver
    ],
    exports: [AuthService]
})
export class ResourceModule implements OnModuleInit {
    constructor(
    ) {
    }

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
        // await this.authService.saveResourcesAndPermissions(this.scanResourcesAndPermissions());
    }

    // private scanResourcesAndPermissions() {
    //     const metadataMap: Map<string, { resource: Resource, permissions: Permission[] }> = new Map();
    //     this.modulesContainer.forEach(module => {
    //         module.components.forEach(component => {
    //             const isResolverOrController =
    //                 Reflect.getMetadataKeys(component.instance.constructor)
    //                     .filter(key => [RESOLVER_TYPE_METADATA, PATH_METADATA]
    //                         .includes(key)).length > 0;
    //
    //             if (isResolverOrController) {
    //                 const resource: Resource = Reflect.getMetadata(RESOURCE_DEFINITION, component.instance.constructor);
    //                 const prototype = Object.getPrototypeOf(component.instance);
    //
    //                 if (prototype) {
    //                     const permissions: Permission[] = this.metadataScanner.scanFromPrototype(component.instance, prototype, name => {
    //                         return Reflect.getMetadata(PERMISSION_DEFINITION, component.instance, name);
    //                     });
    //
    //                     if (resource) {
    //                         resource.name = t(resource.name);
    //                         permissions.forEach(permission => {
    //                             permission.name = t(permission.name);
    //                         });
    //                         metadataMap.set(resource.identify, { resource, permissions });
    //                     }
    //                 }
    //             }
    //         });
    //     });
    //     return metadataMap;
    // }
}
