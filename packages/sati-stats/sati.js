const {asyncHandlerWrap, asyncInitializerWrap} = require('./fc-helper');
const ACMClient = require('@alicloud/acm-sdk');
const ALY = require('aliyun-sdk');
const util = require('util');
let db
let counter = 0;
let acm
let MONGODB_CONNECTION_STR
module.exports.initializer = asyncInitializerWrap(async function (context) {
    acm = new ACMClient({
        endpoint: 'acm.aliyun.com', // check this from acm console
        namespace: 'bf24cec5-8e5e-40fa-bbcd-896bc4bb51fb', // check this from acm console
        accessKey: 'LTAIhIOInA2pDmga', // check this from acm console
        secretKey: '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL', // check this from acm console
        requestTimeout: 6000, // timeout(ms)，default 6s
    });
    MONGODB_CONNECTION_STR = await acm.getConfig('MONGODB_CONNECTION_STR', 'sati');
    console.log('initializing');
    console.log('context: ', JSON.stringify(context));
    db = require('monk')(MONGODB_CONNECTION_STR);
    return '';
});

module.exports.handler = asyncHandlerWrap(async function (event, context) {
    event = JSON.parse(event.toString());
    const sls = new ALY.SLS({
        "accessKeyId": context.credentials.accessKeyId,
        "secretAccessKey": context.credentials.accessKeySecret,
        "securityToken": context.credentials.securityToken,
        endpoint: event.source.endpoint,
        apiVersion: '2015-06-01'
    });

    let total = 0;
    let xLogCursor = event.source.beginCursor;
    while (xLogCursor !== event.source.endCursor) {
        let res = await util.promisify(sls.batchGetLogs).bind(sls)({
            projectName: event.source.projectName,
            logStoreName: event.source.logstoreName,
            ShardId: event.source.shardId,
            cursor: xLogCursor,
            count: 10
        });

        res.body.logGroupList && res.body.logGroupList.forEach((logGroup) => {
            console.info(logGroup.logs.length);
            total += logGroup.logs.length || 0;
        });
        console.warn(event.source.beginCursor, xLogCursor, res.headers["x-log-cursor"], event.source.endCursor);
        if (xLogCursor === res.headers["x-log-cursor"])
            break;
        xLogCursor = res.headers["x-log-cursor"];
    }

    const counters = db.get('counter');
    counter += 1;
    await counters.insert({name: Math.random(), num: counter, total: total});
    console.log("triggerd by sati trigger...");
    console.log("event: " + JSON.stringify(event));
    console.log('context: ', JSON.stringify(context));
    return "trigged..."
});
