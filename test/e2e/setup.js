const _ = require('lodash');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
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

    let con = await MongoClient.connect(process.env.MONGODB_CONNECTION_STR, {useNewUrlParser: true});
    let db = con.db(await replSet.getDbName());
    let userCol = db.collection('user');
    // 等待master就绪
    const admin = db.admin();
    let isMaster = await admin.command({isMaster: 1});
    while(!isMaster.ismaster) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        isMaster = await admin.command({isMaster: 1});
    }


    await userCol.insertOne({
        "mobile": "1",
        "password": "$2a$10$GHG8D.Z8.xjsiy71RfhQu.tCwx/Bld6vqjj6nD6eyom8bhMmsIr3m",
        "nickname": "admin",
        "status": 0,
        "balance": 100007.0,
        "role": 2047.0
    });

    await userCol.insertOne({
        "mobile" : "2",
        "password" : "$2a$10$fQyMSm8LZEqP7oneKyYm1eeyuuVi1FmNexIRwMT8OmEiMKevmTimG",
        "nickname" : "jiangzhuo",
        "status" : 0,
        "balance" : 0.0
    });

    await userCol.insertOne({
        "mobile" : "3",
        "password" : "$2a$10$OhZyFQJp354UXgLxG/EAL.W5YFYAA2M45hjREc3xSYVyF/ubhpuOC",
        "nickname" : "半个月亮没消息",
        "avatar" : "http://sati-test.oss-cn-beijing.aliyuncs.com/avatar/addf9ce0-baff-11e8-90cc-b70dad818327.jpg",
        "status" : 0,
        "balance" : 0.0
    });

    await userCol.insertOne({
        "mobile" : "4",
        "password" : "$2a$10$Ok2PjqyMABrcQtp/QlG0RuZiF1hljZKA3FisZJPwcncdGPsT/jfSG",
        "nickname" : "正月十五月亮圆",
        "avatar" : "http://sati-test.oss-cn-beijing.aliyuncs.com/avatar/addf9ce0-baff-11e8-90cc-b70dad818327.jpg",
        "status" : 0,
        "balance" : 0.0
    });

    await userCol.insertOne({
        "mobile" : "5",
        "password" : "$2a$10$Ok2PjqyMABrcQtp/QlG0RuZiF1hljZKA3FisZJPwcncdGPsT/jfSG",
        "nickname" : "正月十五月亮圆",
        "avatar" : "http://sati-test.oss-cn-beijing.aliyuncs.com/avatar/addf9ce0-baff-11e8-90cc-b70dad818327.jpg",
        "status" : 0,
        "balance" : 0.0
    });
    con.close();
};
