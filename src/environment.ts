import * as AWS from 'aws-sdk';

AWS.config.update({
    credentials: new AWS.Credentials({
        accessKeyId: 'TU_ACCESS_KEY_ID',
        secretAccessKey: 'TU_SECRET_ACCESS_KEY',
    }),
});

const s3 = new AWS.S3();
const params = {
    Bucket: 'sharehubbucket',
    Key: 'NOMBRE_DEL_ARCHIVO',
    Body: 'index.html',
};

s3.upload(params, (err: any, data: any) => {
    if (err) {
        console.log('Error al subir el archivo:', err);
    } else {
        console.log('Archivo subido exitosamente:', data);
    }
});
