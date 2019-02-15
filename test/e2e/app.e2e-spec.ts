// import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
// import { CatsService } from '../../src/cats/cats.service';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';

const mongoUnit = require('mongo-unit');

describe('Cats', () => {
    let app: INestApplication;
    // let queryClient;

    beforeAll(async () => {
        const mongoUrl = await mongoUnit.start();
        console.log(mongoUrl);
        console.log(11111111);
        process.env = {
            SENTRY_DSN: 'https://f788de537d2648cb96b4b9f5081165c1@sentry.io/1318216',
            SSL_PRIVATE_KEY:
              '-----BEGIN PRIVATE KEY-----\r\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCTY67xQb81T2li\r\nOEZmoYqTvuc1SfIRFMDK8RQKb6wijW9mzSYBo9gFTxI2VmDwy50Qjmy8aT+eGRS9\r\nJdbid22iHjqoZkpnASAEFd6lTioRwPYYKVhqTYWYeFwtIabex9uD73wWDuZngH0m\r\nLMhLLAqk/Q94IU4GFujLzeiTY5cqWuyqkaQPIUyvPXg9xc9b41BMjZ1seFCvam/P\r\nUOIm3zITNzKcLG04alm/m6oTEhzT/pMxIqRfqYLuREy5h7nYYZBX2hQFVJEkht0v\r\nLUssgxvDqnquURljOx4X/btOuIz3Xuj5ebKImrxfBoRD96yjSYL/OyrY6qqwcGiW\r\nXjc9sjyfAgMBAAECggEAe/W3ueLw/NYoLNplo4WztiU18eSaOXF54HU3xLs9S+Ym\r\nTpC1qWVylqx1BcxKRdsJ41XV7/SY88/mWFrNyrRlOZcxAFbftpgEpEr8cY025q2i\r\njJmhae5/MMfxxmdqIC542hL+CtNHRr+TAhth7Y9B+Jd5fjCMnaSA8H/iXqvBBHYj\r\nmoNMxhEy2u2wDA0xne2ScZh+xUnottPhphqApVb0gxgaMQA2Bv4OqlroCeWHMTXn\r\nD5XooeO4hmpN7CRLnPeqDUWE/6vhUZeVUWJDtgJZpveGMglFF5J2O5OESwzw+M8y\r\nG40EwunJA5xM25C0TVZGZ2dKsfR5JEpn0gf8IqQd4QKBgQDEGaapjTcd5klNHFhR\r\nKbwNYtianmCAOulNK0opahkklcU0XPbBVvgP9C7IfhB+3q/C/xB0/STql9SteV5H\r\nzZJ2J3z+v205B/LjDdKI0JifLGomzsoNj17Ttg0XM/EnRSpZ9fm9ozbxlpxtSKSi\r\ntVnaiNvrpg9v1llSwwDb1BDNcQKBgQDAaQR4ifDKz8T2QRL96OKzxf29+FAfx5iq\r\nsSkCKukSqLvZPmUelIdOYtjguUb2rbn4RnvWS4fbtJcNYi1bds+SQQxy4JpnTARy\r\n2HYKYUaCeVNywabm9wasKIkCTTjAL51/LVdtY3d+kcn95u6zH6S+WBdjAt+QEMpf\r\nILEZ6bvjDwKBgAE7mAyg0qPherx9XSDFfmUnJe1y6XBk7mqJxyGThSzxtBesLfDx\r\nNwYCpvijsj7Z74juSZAytzSyV6fvh2Q0KqOLhAGl+m3NWv2KbLRne04k3VX5HtQO\r\n/q2eC18F+JIioS2HmlZS3FmQdNNLDZ3oPfRdv+QvWxF863rVtv+qyaBBAoGAQIW2\r\n+xj+x3QfD5lI3h6vjyuQ6JiRfea3+l2Ia/Kp0BkHTVWQIU4bhZy+L7XR5zzgxTIV\r\nqwoPGA0aLmHC5g4Uk23+17Mb9BHY2A5gnyB5vZ0j77Ki3obuFONO9pegtUoCXbh9\r\nvfACDU6kVuGPIEA3RaFSzmATSkNnKblTymXIHN8CgYAeLUIHHqbjgR1pwXj5z9Va\r\nQu4hXLo1cB9Wl+Q9aLoSmmL7Me//60oQawXCU2hNMnc7jJNvSoScNxXaGrSJq0NV\r\nW5IS6Q6ucjfSjBsj8AApq2eRQSA8lvHKwjHIf636i8vrJw2FdduaWbDChfGO8B8r\r\nYHItK0i3rnS36ls6SWCQDA==\r\n-----END PRIVATE KEY-----\r\n',
            SSL_CERTIFICATE:
              '-----BEGIN CERTIFICATE-----\r\nMIIFVjCCBD6gAwIBAgISA4XBiu0p37+e3On1Ejs4Bi3YMA0GCSqGSIb3DQEBCwUA\r\nMEoxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MSMwIQYDVQQD\r\nExpMZXQncyBFbmNyeXB0IEF1dGhvcml0eSBYMzAeFw0xODExMTgyMTMwMDVaFw0x\r\nOTAyMTYyMTMwMDVaMBoxGDAWBgNVBAMTD3NhdGkuZGFubWFrdS5jbjCCASIwDQYJ\r\nKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJNjrvFBvzVPaWI4RmahipO+5zVJ8hEU\r\nwMrxFApvrCKNb2bNJgGj2AVPEjZWYPDLnRCObLxpP54ZFL0l1uJ3baIeOqhmSmcB\r\nIAQV3qVOKhHA9hgpWGpNhZh4XC0hpt7H24PvfBYO5meAfSYsyEssCqT9D3ghTgYW\r\n6MvN6JNjlypa7KqRpA8hTK89eD3Fz1vjUEyNnWx4UK9qb89Q4ibfMhM3MpwsbThq\r\nWb+bqhMSHNP+kzEipF+pgu5ETLmHudhhkFfaFAVUkSSG3S8tSyyDG8Oqeq5RGWM7\r\nHhf9u064jPde6Pl5soiavF8GhEP3rKNJgv87KtjqqrBwaJZeNz2yPJ8CAwEAAaOC\r\nAmQwggJgMA4GA1UdDwEB/wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYB\r\nBQUHAwIwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUQiyLC1UAu6cx9zfWjNP5ywWA\r\nW1AwHwYDVR0jBBgwFoAUqEpqYwR93brm0Tm3pkVl7/Oo7KEwbwYIKwYBBQUHAQEE\r\nYzBhMC4GCCsGAQUFBzABhiJodHRwOi8vb2NzcC5pbnQteDMubGV0c2VuY3J5cHQu\r\nb3JnMC8GCCsGAQUFBzAChiNodHRwOi8vY2VydC5pbnQteDMubGV0c2VuY3J5cHQu\r\nb3JnLzAaBgNVHREEEzARgg9zYXRpLmRhbm1ha3UuY24wTAYDVR0gBEUwQzAIBgZn\r\ngQwBAgEwNwYLKwYBBAGC3xMBAQEwKDAmBggrBgEFBQcCARYaaHR0cDovL2Nwcy5s\r\nZXRzZW5jcnlwdC5vcmcwggEEBgorBgEEAdZ5AgQCBIH1BIHyAPAAdgDiaUuuJujp\r\nQAnohhu2O4PUPuf+dIj7pI8okwGd3fHb/gAAAWco8fesAAAEAwBHMEUCIBe+Bmnl\r\nqeJNu9Trzg89b2pgrYaJBdUXlZYcD9r3mq+2AiEAp/nd2xbA6PSj0e7kiM/Tn7BE\r\np8R5RSm0RCM/8g4LKKgAdgBj8tvN6DvMLM8LcoQnV2szpI1hd4+9daY4scdoVEvY\r\njQAAAWco8fnrAAAEAwBHMEUCIQDS1+hGyL1uXOxRalgACefkGUdjFZtlBsk5gdbl\r\n1sxlRgIgMnBYW9LdamyKVa2ZpYslDzVDrCRACH0qtj3volYX5EQwDQYJKoZIhvcN\r\nAQELBQADggEBAGOQjSf441V7xB+MuBV2FrvSHqV8aAwyv4pcOq2RXWnrSsX2pkdl\r\nNK0lVzZuSiloKqg1t1WIiSlm3Es8HLEVr++VmZ7iNG0968IUID9C47W1Xh+upfrC\r\nMnMuDV8SjD4dt2994vJLM1M6s4ArBFCd8BDOO33Y7DP0FAgSwvrXIGKnWT9uFx/q\r\nMeSL+Q11xkXwYLbDzlMYvYQqd+XprI0bqdXE87oZu2wAT+eiTEF8IKZOXoPaJqE/\r\n+0AnbAV28haYanSICVea8EQZyvSeLJ1Ai1fTjl9vPNUmha1EWXoYcWo673vBGrch\r\n3AmTYsCXm1DgbbhfBbvOac9YNjebUYlaIE0=\r\n-----END CERTIFICATE-----\r\n',
            SSL_CA:
              '-----BEGIN CERTIFICATE-----\r\nMIIEkjCCA3qgAwIBAgIQCgFBQgAAAVOFc2oLheynCDANBgkqhkiG9w0BAQsFADA/\r\nMSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT\r\nDkRTVCBSb290IENBIFgzMB4XDTE2MDMxNzE2NDA0NloXDTIxMDMxNzE2NDA0Nlow\r\nSjELMAkGA1UEBhMCVVMxFjAUBgNVBAoTDUxldCdzIEVuY3J5cHQxIzAhBgNVBAMT\r\nGkxldCdzIEVuY3J5cHQgQXV0aG9yaXR5IFgzMIIBIjANBgkqhkiG9w0BAQEFAAOC\r\nAQ8AMIIBCgKCAQEAnNMM8FrlLke3cl03g7NoYzDq1zUmGSXhvb418XCSL7e4S0EF\r\nq6meNQhY7LEqxGiHC6PjdeTm86dicbp5gWAf15Gan/PQeGdxyGkOlZHP/uaZ6WA8\r\nSMx+yk13EiSdRxta67nsHjcAHJyse6cF6s5K671B5TaYucv9bTyWaN8jKkKQDIZ0\r\nZ8h/pZq4UmEUEz9l6YKHy9v6Dlb2honzhT+Xhq+w3Brvaw2VFn3EK6BlspkENnWA\r\na6xK8xuQSXgvopZPKiAlKQTGdMDQMc2PMTiVFrqoM7hD8bEfwzB/onkxEz0tNvjj\r\n/PIzark5McWvxI0NHWQWM6r6hCm21AvA2H3DkwIDAQABo4IBfTCCAXkwEgYDVR0T\r\nAQH/BAgwBgEB/wIBADAOBgNVHQ8BAf8EBAMCAYYwfwYIKwYBBQUHAQEEczBxMDIG\r\nCCsGAQUFBzABhiZodHRwOi8vaXNyZy50cnVzdGlkLm9jc3AuaWRlbnRydXN0LmNv\r\nbTA7BggrBgEFBQcwAoYvaHR0cDovL2FwcHMuaWRlbnRydXN0LmNvbS9yb290cy9k\r\nc3Ryb290Y2F4My5wN2MwHwYDVR0jBBgwFoAUxKexpHsscfrb4UuQdf/EFWCFiRAw\r\nVAYDVR0gBE0wSzAIBgZngQwBAgEwPwYLKwYBBAGC3xMBAQEwMDAuBggrBgEFBQcC\r\nARYiaHR0cDovL2Nwcy5yb290LXgxLmxldHNlbmNyeXB0Lm9yZzA8BgNVHR8ENTAz\r\nMDGgL6AthitodHRwOi8vY3JsLmlkZW50cnVzdC5jb20vRFNUUk9PVENBWDNDUkwu\r\nY3JsMB0GA1UdDgQWBBSoSmpjBH3duubRObemRWXv86jsoTANBgkqhkiG9w0BAQsF\r\nAAOCAQEA3TPXEfNjWDjdGBX7CVW+dla5cEilaUcne8IkCJLxWh9KEik3JHRRHGJo\r\nuM2VcGfl96S8TihRzZvoroed6ti6WqEBmtzw3Wodatg+VyOeph4EYpr/1wXKtx8/\r\nwApIvJSwtmVi4MFU5aMqrSDE6ea73Mj2tcMyo5jMd6jmeWUHK8so/joWUoHOUgwu\r\nX4Po1QYz+3dszkDqMp4fklxBwXRsW10KXzPMTZ+sOPAveyxindmjkW8lGy+QsRlG\r\nPfZ+G6Z6h7mjem0Y+iWlkYcV4PIWL1iwBi8saCbGS5jN2p8M+X+Q7UNKEkROb3N6\r\nKOqkqm57TH2H3eDJAkSnh6/DNFu0Qg==\r\n-----END CERTIFICATE-----\r\n',
            HTTP_PORT: '5000',
            HTTPS_PORT: '442',
            LOG_LEVEL: 'debug',
            OSS_REGION: 'oss-cn-shanghai',
            OSS_ACCESS_KEY_ID: 'LTAIhIOInA2pDmga',
            OSS_ACCESS_KEY_SECRET: '9FNpKB1WZpEwxWJbiWSMiCfuy3E3TL',
            OSS_BUCKET: 'sati-test-hd',
            OSS_BASE_URL: 'https://sati-test-hd.oss-cn-shanghai.aliyuncs.com',
            BASE_URL: 'config data not exist\n',
            WHITELIST_OPERATION_NAME:
              '["IntrospectionQuery", "sayHello", "test", "adminTest", "home", "getHome", "getHomeById", "getNew", "loginBySMSCode","loginByMobileAndPassword", "sendRegisterVerificationCode", "sendLoginVerificationCode", "registerBySMSCode"]',
            AUTH_TOKEN_SECRET_KEY: 'secretKey',
            TRANSPORTER: 'TCP',

        };
        const module = await Test.createTestingModule({
            imports: [AppModule],
        })
          .compile();

        app = module.createNestApplication();
        await app.init();

    }, 1000000);

    it(`/GET cats`, async () => {
        // return true;

        // let res = await queryClient({query:'query helloStat {  helloStat {    code    message  }}'});
        // console.log(res);
        const res = await supertest(app.getHttpServer())
          .post('/graphql')
          .send({
              query: 'query helloStat {  helloStat {    code    message  }}',
          });
        expect(res.status).toBe(200);

    });

    afterAll(async () => {
        console.log(22222)
        // await app.close();
        console.log(33333)
        await mongoUnit.stop();
        console.log(44444)
    });
});
