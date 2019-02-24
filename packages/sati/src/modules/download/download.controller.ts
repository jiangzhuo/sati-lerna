import { Controller, FileInterceptor, Get, UploadedFile, UseInterceptors, Param, Res } from '@nestjs/common';
import * as OSS from 'ali-oss';

import { ErrorsInterceptor } from '../../common/interceptors';

// import { Configurable, ConfigParam, ConfigService } from 'nestjs-config';

@Controller()
@UseInterceptors(ErrorsInterceptor)
export class DownloadController {
    constructor() {
    }

    @Get('download/:fileName')
    @UseInterceptors(FileInterceptor('file'))
    async download(@Res() res, @Param('fileName') fileName) {
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


        const client = new OSS({
            region: process.env.OSS_REGION,
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            bucket: process.env.OSS_BUCKET,
            internal: true,
        });
        // const result = await client.getStream(`test/${fileName}`);
        // result.stream.pipe(res);
        const signatureUrl = await client.signatureUrl(`test/${fileName}`);
        console.log(signatureUrl);
        res.redirect(signatureUrl);
    }
}
