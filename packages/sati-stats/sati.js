const {asyncHandlerWrap, asyncInitializerWrap} = require('./fc-helper');
const ACMClient = require('@alicloud/acm-sdk');
const ALY = require('aliyun-sdk');
const util = require('util');
const _ = require('lodash');
let db
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
    // console.log('initializing');
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

    let normalRecord = [];
    while (xLogCursor !== event.source.endCursor) {
        console.log(xLogCursor ,event.source.endCursor)
        let res = await util.promisify(sls.batchGetLogs).bind(sls)({
            projectName: event.source.projectName,
            logStoreName: event.source.logstoreName,
            ShardId: event.source.shardId,
            cursor: xLogCursor,
            count: 10
        });

        res.body.logGroupList && res.body.logGroupList.forEach((logGroup) => {
            total += logGroup.logs.length || 0;
            logGroup.logs.forEach((log) => {
                let payload = _.reduce(log.contents, (obj, param) => {
                    obj[param.key] = param.value;
                    return obj
                }, {});
                if (payload.namespace === 'NEST' && (['DISCOUNT', 'HOME', 'MINDFULNESS', 'MINDFULNESSALBUM', 'NATURE', 'NATUREALBUM', 'WANDER', 'WANDERALBUM', 'SCENE', 'COUPON', 'USER'].includes(payload.module))) {
                    // ${context.user && context.user.id}\t${context.udid}\t${context.clientIp}\t${context.operationName}\t${resolveInfo.fieldName}\t${JSON.stringify(data)}
                    normalRecord.push({
                        timestamp: payload.timestamp,
                        server: payload.server,
                        namespace: payload.namespace,
                        module: payload.module,
                        userId: payload.__column5__,
                        uuid: payload.__column6__,
                        clientIp: payload.__column7__,
                        operationName: payload.__column8__,
                        fieldName: payload.__column9__,
                        other: payload.__column10__,
                    })
                }
            })
        });
        if (xLogCursor === res.headers["x-log-cursor"])
            break;
        xLogCursor = res.headers["x-log-cursor"];
    }

    const operationCol = db.get('operation');
    const insertResult = await operationCol.insert(normalRecord);
    return `operation inserted ${insertResult.insertedCount}`;
});
