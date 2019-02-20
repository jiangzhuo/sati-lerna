const _ = require('lodash');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const replSet = new MongoMemoryReplSet();

module.exports = async () => {
    // Set reference to mongod in order to close the server during teardown.
    console.log("global setup");

    await replSet.waitUntilRunning();
    process.env = _.merge(process.env, {
        SENTRY_DSN: 'https://f788de537d2648cb96b4b9f5081165c1@sentry.io/1318216',
        HTTP_PORT: '5000',
        HTTPS_PORT: '442',
        LOG_LEVEL: 'warn',
        OSS_REGION: 'oss-cn-shanghai',
        OSS_ACCESS_KEY_ID: 'LTAIhIOInA2pDmga',
        OSS_ACCESS_KEY_SECRET: '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL',
        OSS_BUCKET: 'sati-test-hd',
        OSS_BASE_URL: 'https://sati-test-hd.oss-cn-shanghai.aliyuncs.com',
        BASE_URL: 'https://sati-test-hd.oss-cn-shanghai.aliyuncs.com',
        WHITELIST_OPERATION_NAME:
            '["IntrospectionQuery", "sayHello", "test", "adminTest", "home", "getHome", "getHomeById", "getNew", "loginBySMSCode","loginByMobileAndPassword", "sendRegisterVerificationCode", "sendLoginVerificationCode", "registerBySMSCode"]',
        AUTH_TOKEN_SECRET_KEY: 'secretKey',
        TRANSPORTER: 'TCP',
        MONGODB_CONNECTION_STR:
            await replSet.getConnectionString(),
        SMS_ACCESS_KEY_ID: 'LTAIhIOInA2pDmga',
        SMS_ACCESS_KEY_SECRET: '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL',
        SMS_SIGN_NAME: 'ewtf234rfrf',
        SMS_REGISTER_TEMPLATE_CODE: 'SMS_144942599',
        SMS_LOGIN_TEMPLATE_CODE: 'SMS_144853217'
    });
    global.__replSet__ = replSet;
};
