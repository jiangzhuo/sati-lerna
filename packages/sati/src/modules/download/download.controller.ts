import { Controller, Get, Param, Res, Req } from '@nestjs/common';
import * as OSS from 'ali-oss';
import { ServiceBroker } from "moleculer";
import { InjectBroker } from 'nestjs-moleculer';
import { AuthService } from '../user/auth/auth.service';

// import { Configurable, ConfigParam, ConfigService } from 'nestjs-config';

@Controller()
// @UseInterceptors(ErrorsInterceptor)
export class DownloadController {
    constructor(
        @InjectBroker() private readonly resourceBroker: ServiceBroker,
        private readonly authService: AuthService
    ) {
    }

    @Get('download/:type/:resourceId/:fileName')
    // @UseInterceptors(FileInterceptor('file'))
    async download(@Req() req, @Res() res, @Param('type') type, @Param('resourceId') resourceId, @Param('fileName') fileName) {
        // throw new Error('what the fuck')
        let user = await this.authService.validateUser(req);
        // const stsClient = new Core({
        //     accessKeyId: process.env.STS_ACCESS_KEY_ID || 'LTAIhIOInA2pDmga',
        //     accessKeySecret: process.env.STS_ACCESS_KEY_SECRET || '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL',
        //     endpoint: process.env.STS_ENDPOINT || 'https://sts.aliyuncs.com',
        //     apiVersion: '2015-04-01'
        // });
        //
        // const params = {
        //     'RoleArn': process.env.OSS_ROLE_ARN || 'acs:ram::1907979290938635:role/aliyunossreadonlyaccess',
        //     'RoleSessionName': 'sati'
        // };
        //
        // let stsResult = await stsClient.request('AssumeRole', params);
        //
        // console.log(stsResult)

        // todo 先验证一下是否有权限下载这个资源
        // 请求的地址类似于https://sati.danmaku.cn/download/<type>/<resourceId>/<fileName>
        // const [type, resourceId, filename] = fileName.split('/');
        let getRecordMethod = '';
        let getResourceMethod = '';
        let idParName = '';
        let haveAccess = false;

        switch (type) {
            case "mindfulness":
                getRecordMethod = "mindfulness.getMindfulnessRecordByMindfulnessId";
                getResourceMethod = "mindfulness.getMindfulnessById";
                idParName = 'mindfulnessId';
                break;
            case "mindfulnessAlbum":
                getRecordMethod = "mindfulnessAlbum.getMindfulnessAlbumRecordByMindfulnessAlbumId";
                getResourceMethod = "mindfulnessAlbum.getMindfulnessAlbumById";
                idParName = 'mindfulnessAlbumId';
                break;
            case "nature":
                getRecordMethod = "nature.getNatureRecordByNatureId";
                getResourceMethod = "nature.getNatureById";
                idParName = 'natureId';
                break;
            case "natureAlbum":
                getRecordMethod = "natureAlbum.getNatureAlbumRecordByNatureAlbumId";
                getResourceMethod = "natureAlbum.getNatureAlbumById";
                idParName = 'natureAlbumId';
                break;
            case "wander":
                getRecordMethod = "wander.getWanderRecordByWanderId";
                getResourceMethod = "wander.getWanderById";
                idParName = 'wanderId';
                break;
            case "wanderAlbum":
                getRecordMethod = "wanderAlbum.getWanderAlbumRecordByWanderAlbumId";
                getResourceMethod = "wanderAlbum.getWanderAlbumById";
                idParName = 'wanderAlbumId';
                break;
            case "avatar":
                // avatar不用验证
                // getRecordMethod = "nature.getAvatarRecordByAvatarId";
                // idParName='mindfulnessAlbumId';
                haveAccess = true;
                break;
            case "background":
                // background不用验证
                // getRecordMethod = "nature.getNatureRecordByNatureId";
                // idParName='mindfulnessAlbumId';
                haveAccess = true;
                break;
            default:
                throw new Error('no support download type')
        }

        if (!haveAccess) {
            let userId = '';
            const { data: resourceData } = await this.resourceBroker.call(getResourceMethod, { id: resourceId });
            try {
                const { data: recordData } = await this.resourceBroker.call(getRecordMethod, {
                    userId: userId,
                    [idParName]: resourceId,
                });
                if (recordData.price === 0) {
                    haveAccess = true;
                }
                if (resourceData.boughtTime) {
                    haveAccess = true;
                }
            } catch (err) {
                // console.error(err)
                throw err
            }
        }

        if (haveAccess) {
            // 获取签名后的网址给客户端返回个转向
            const client = new OSS({
                region: process.env.OSS_REGION,
                accessKeyId: process.env.OSS_ACCESS_KEY_ID,
                accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
                bucket: process.env.OSS_BUCKET,
                // internal: true,
            });
            // const result = await client.getStream(`test/${fileName}`);
            // result.stream.pipe(res);
            const signatureUrl = await client.signatureUrl(`test/${fileName}`);
            res.redirect(signatureUrl);
        } else {
            throw Error('no right resource');
        }
    }
}
