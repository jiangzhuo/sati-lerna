import * as Sentry from '@sentry/node';
import { hostname } from 'os';
import './hackLogger';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

// import * as fs from 'fs';
import express = require('express');
import * as http from 'http';
const JSONStream = require('json-stream');

const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
// 初始化一个k8s的client
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });

async function bootstrap() {
    // 初始化Logger
    const logger = new Logger('sati');

    let namespace = process.env.ACM_NAMESPACE || 'default';
    // const acm = new ACMClient({
    // // const acm = new ACMClient({
    //     endpoint: process.env.ACM_ENDPOINT || 'acm.aliyun.com', // acm 控制台查看
    //     namespace: process.env.ACM_NAMESPACE || '7d2026a8-72a8-4e56-893f-91dfa8ffc207', // acm 控制台查看
    //     accessKey: process.env.ACM_ACCESS_KEY_ID || 'LTAIhIOInA2pDmga', // acm 控制台查看
    //     secretKey: process.env.ACM_ACCESS_KEY_SECRET || '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL', // acm 控制台查看
    //     requestTimeout: parseInt(process.env.ACM_TIMEOUT) || 6000, // 请求超时时间，默认6s
    // });

    let configRes = await client.api.v1.namespaces(namespace).configmaps('sati').get();
    // await acm.ready();
    // const allConfigs = await acm.getConfigs();
    const allConfigs = [
        { dataId: 'SENTRY_DSN', group: 'sati' },
        { dataId: 'HTTP_PORT', group: 'sati' },
        { dataId: 'HTTPS_PORT', group: 'sati' },
        { dataId: 'LOG_LEVEL', group: 'sati' },
        { dataId: 'OSS_REGION', group: 'sati' },
        { dataId: 'OSS_ACCESS_KEY_ID', group: 'sati' },
        { dataId: 'OSS_ACCESS_KEY_SECRET', group: 'sati' },
        { dataId: 'OSS_BUCKET', group: 'sati' },
        { dataId: 'OSS_BASE_URL', group: 'sati' },
        { dataId: 'BASE_URL', group: 'sati' },
        { dataId: 'WHITELIST_OPERATION_NAME', group: 'sati' },
        { dataId: 'AUTH_TOKEN_SECRET_KEY', group: 'sati' },
        { dataId: 'TRANSPORTER', group: 'sati' },
        // { dataId: 'STS_ACCESS_KEY_ID', group: 'sati' },
        // { dataId: 'STS_ACCESS_KEY_SECRET', group: 'sati' },
        // { dataId: 'STS_ENDPOINT', group: 'sati' },
        // { dataId: 'OSS_ROLE_ARN', group: 'sati' },
    ];
    allConfigs.forEach((config) => {
        process.env[config.dataId] = configRes.body.data[config.dataId];
    });
    logger.log('init config finished');

    let stream = await client.api.v1.watch.namespaces(namespace).configmaps('sati').getStream();
    const jsonStream = new JSONStream();
    stream.pipe(jsonStream);
    jsonStream.on('data', event => {
        if(event.type === 'MODIFIED'){
            allConfigs.forEach((config) => {
                process.env[config.dataId] = event.object.data[config.dataId];
                // console.log(`${config.dataId} = ${process.env[config.dataId]} = ${event.object.data[config.dataId]}`)
            });
            // console.log('Event: ', JSON.stringify(object, null, 2))
        }
    });

    logger.log('watch config finished');

    // 初始化sentry
    Sentry.init({ dsn: process.env.SENTRY_DSN, serverName: hostname() });

    // const privateKey = process.env.SSL_PRIVATE_KEY;
    // const certificate = process.env.SSL_CERTIFICATE;
    // const ca = process.env.SSL_CA;

    // const credentials = {
    //     key: privateKey,
    //     cert: certificate,
    //     ca,
    // };

    try {
        const server = express();
        // const app = await NestFactory.create(AppModule, server, { cors: true, httpsOptions: credentials });
        const { AppModule } = require('./app.module');
        const app = await NestFactory.create(AppModule, server, { cors: true });
        await app.init();

        http.createServer(server).listen(parseInt(process.env.HTTP_PORT, 10));
        // https.createServer(credentials, server).listen(parseInt(process.env.HTTPS_PORT, 10));
    } catch (e) {
        logger.error(e);
        throw e;
    }
}

bootstrap();
