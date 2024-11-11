const AWS = require('aws-sdk');

const REGION = process.env.S3_REGION;
const BUCKET_NAME = process.env.S3_BUCKET;

const s3 = new AWS.S3({
    region: REGION,
    accessKeyId: process.env.S3_ACCESS,
    secretAccessKey: process.env.S3_SECRET,
});

const s3params = (key) => ({
    Key: key,
    Bucket: BUCKET_NAME,
});

const uploadFile = (file, key) => s3.upload({
    ...s3params(key),
    Body: file,
}).promise();

const deleteFile = async (key) => s3.deleteObject(s3params(key)).promise();

const downloadFile = (key, errorHandler = () => {}) => s3.getObject(s3params(key)).createReadStream().on('error', error => {
    console.error('Error while downloading file ' + error);
    errorHandler();
});

module.exports = {
    uploadFile,
    deleteFile,
    downloadFile,
};