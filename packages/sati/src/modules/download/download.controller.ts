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
        const client = new OSS({
            region: process.env.OSS_REGION,
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            bucket: process.env.OSS_BUCKET,
            internal: true,
        });
        const result = await client.getStream(`test/${fileName}`);
        result.stream.pipe(res)
    }
}
