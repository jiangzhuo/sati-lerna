import { hostname } from "os";
import * as Sentry from '@sentry/node';
import './hackLogger';
import { NestFactory } from '@nestjs/core';
import { Logger } from "@nestjs/common";
import { NacosConfigClient } from 'nacos';

async function bootstrap() {
    const logger = new Logger();

    // 初始化ACM或者配置
    const acm = new NacosConfigClient({
        endpoint: 'acm.aliyun.com', // acm 控制台查看
        namespace: process.env.ACM_NAMESPACE || '7d2026a8-72a8-4e56-893f-91dfa8ffc207', // acm 控制台查看
        accessKey: process.env.ACM_ACCESS_KEY_ID || 'LTAIhIOInA2pDmga', // acm 控制台查看
        secretKey: process.env.ACM_ACCESS_KEY_SECRET || '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL', // acm 控制台查看
        requestTimeout: parseInt(process.env.ACM_TIMEOUT) || 6000, // 请求超时时间，默认6s
    });
    await acm.ready();
    // const allConfigs = await acm.getConfigs();
    const allConfigs = [
        { dataId: 'ACM_NAMESPACE', group: 'sati' },
        { dataId: 'ACM_ACCESS_KEY_ID', group: 'sati' },
        { dataId: 'ACM_ACCESS_KEY_SECRET', group: 'sati' },
        { dataId: 'ACM_TIMEOUT', group: 'sati' },
        { dataId: 'SENTRY_DSN', group: 'sati' },
        { dataId: 'LOG_LEVEL', group: 'sati' },
        { dataId: 'ELASTICSEARCH_HOST', group: 'sati' },
        { dataId: 'ELASTICSEARCH_HTTP_AUTH', group: 'sati' },
        { dataId: 'MONGODB_CONNECTION_STR', group: 'sati' },
        { dataId: 'SMS_ACCESS_KEY_ID', group: 'sati' },
        { dataId: 'SMS_ACCESS_KEY_SECRET', group: 'sati' },
        { dataId: 'SMS_SIGN_NAME', group: 'sati' },
        { dataId: 'SMS_REGISTER_TEMPLATE_CODE', group: 'sati' },
        { dataId: 'SMS_LOGIN_TEMPLATE_CODE', group: 'sati' },
        { dataId: 'TRANSPORTER', group: 'sati' }
    ];
    const getAllConfigPromise = [];
    allConfigs.forEach((config) => {
        getAllConfigPromise.push(acm.getConfig(config.dataId, config.group).then((content) => {
            return { config, content };
        }));
    });
    const allConfigResult = await Promise.all(getAllConfigPromise);
    allConfigResult.forEach((res) => {
        process.env[res.config.dataId] = res.content;
        // logger.log(`${res.config.dataId}    -   ${res.content}`);
        acm.subscribe(res.config, (content) => {
            process.env[res.config.dataId] = content;
        });
    });
    logger.log('init config finished');

    Sentry.init({ dsn: process.env.SENTRY_DSN, serverName: hostname() });

    try {
        const { StatsModule } = require('./stats.module');
        const app = await NestFactory.createApplicationContext(StatsModule.forRoot());
    } catch (e) {
        logger.error(e);
        throw e;
    }
}

bootstrap();
