import { Controller, FileInterceptor, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import * as OSS from 'ali-oss';
import * as hasha from 'hasha';
import { getExtension } from 'mime';

// import { Configurable, ConfigParam, ConfigService } from 'nestjs-config';

@Controller()
export class UploadController {
    constructor() {
        // setTimeout(() => {
        //     this.config.set('my.parameter', 'jiangzhuo');
        // }, 10000);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file) {
        const client = new OSS({
            region: process.env.OSS_REGION,
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            bucket: process.env.OSS_BUCKET,
            // internal: true,
        });
        const fileName = `${hasha(file.buffer, { algorithm: 'md5' })}.${getExtension(file.mimetype)}`;
        const filename = `test/${fileName}`;
        await client.put(filename, file.buffer);
        return { code: 200, message: 'upload avatar success', data: fileName };
    }

    @Post('uploadAvatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file) {
        const client = new OSS({
            region: process.env.OSS_REGION,
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            bucket: process.env.OSS_BUCKET,
            internal: true,
        });
        // let hash = hasha(file.buffer, { algorithm: 'md5' });
        // console.log(hash);
        const filename = `avatar/${hasha(file.buffer, { algorithm: 'md5' })}.${getExtension(file.mimetype)}`;
        await client.put(filename, file.buffer);
        return { code: 200, message: 'upload avatar success', data: await client.generateObjectUrl(filename, process.env.OSS_BASE_URL) };
    }

    @Post('uploadBackground')
    @UseInterceptors(FileInterceptor('file'))
    async uploadBackground(@UploadedFile() file) {
        const client = new OSS({
            region: process.env.OSS_REGION,
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            bucket: process.env.OSS_BUCKET,
            internal: true,
        });
        // let hash = hasha(file.buffer, { algorithm: 'md5' });
        // console.log(hash);
        const filename = `background/${hasha(file.buffer, { algorithm: 'md5' })}.${getExtension(file.mimetype)}`;
        await client.put(filename, file.buffer);
        return { code: 200, message: 'upload background success', data: await client.generateObjectUrl(filename, process.env.OSS_BASE_URL) };
    }

    @Post('uploadAudio')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAudio(@UploadedFile() file) {
        const client = new OSS({
            region: process.env.OSS_REGION,
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            bucket: process.env.OSS_BUCKET,
            internal: true,
        });
        // let hash = hasha(file.buffer, { algorithm: 'md5' });
        // console.log(hash);
        const filename = `audio/${hasha(file.buffer, { algorithm: 'md5' })}.${getExtension(file.mimetype)}`;
        await client.put(filename, file.buffer);
        return { code: 200, message: 'upload audio success', data: await client.generateObjectUrl(filename, process.env.BASE_URL) };
    }
}
