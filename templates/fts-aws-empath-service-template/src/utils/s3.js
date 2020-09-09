const AWS = require('aws-sdk');
const stream = require('stream');
const readline = require('readline');

const s3 = new AWS.S3();

const createProcessedWriteStream = (bucket, key) => {
  const writeStream = new stream.PassThrough();
  const uploadPromise = s3
    .upload({
      Bucket: bucket,
      Key: decodeURIComponent(key.replace(/\+/g, ' ')),
      Body: writeStream,
      ContentType: 'application/json',
    })
    .promise();

  return { writeStream, uploadPromise };
};

const readStreamByLine = async (bucket, key, callback) => {
  const s3Stream = s3
    .getObject({
      Bucket: bucket,
      Key: decodeURIComponent(key.replace(/\+/g, ' ')),
    })
    .createReadStream();
  const inputLines = readline.createInterface({
    input: s3Stream,
    crlfDelay: Infinity,
  });

  for await (const line of inputLines) {
    callback(line);
  }
};

module.exports = { createProcessedWriteStream, readStreamByLine };
