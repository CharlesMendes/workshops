'use strict';

const AWS = require('aws-sdk');
const sharp = require('sharp');
const { basename, extname } = require('path');

const S3 = new AWS.S3();

module.exports.handle = async ({ Records: records }, context) => {
    try {
        await Promise.all(records.map(async record => {
            const { key } = record.s3.object;

            // captura a imagem que esta no bucket
            const image = await S3.getObject({
                Bucket: process.env.bucket,
                Key: key,
            }).promise();

            // configura a imagem para o novo formato
            const optimized = await sharp(image.Body)
                .resize(1280, 720, { fit: 'inside', withoutEnlargement: true })
                .toFormat('jpeg', { progressive: true, quality: 50 })
                .toBuffer()

            // salvar a nova imagem no s3
            const arquivo = `compressed/${basename(key, extname(key))}.jpg`;
            console.log(arquivo);

            await S3.putObject({
                Body: optimized,
                Bucket: process.env.bucket,
                ContentType: 'image/jpeg',
                Key: arquivo
            }).promise();
        }));

        return {
            statusCode: 301,
            body: {}
        }
    } catch (error) {
        return error;
    }
};
