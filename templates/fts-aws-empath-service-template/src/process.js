const { getParameters } = require('./utils/ssm');
const { createProcessedWriteStream, readStreamByLine } = require('./utils/s3');

module.exports.process = async event => {
  const { SSM_PROCESS_BUCKET_NAME } = process.env;
  const parameters = await getParameters(SSM_PROCESS_BUCKET_NAME);

  for (const record of event.Records) {
    const { key } = record.s3.object;

    const { writeStream, uploadPromise } = createProcessedWriteStream(
      parameters[SSM_PROCESS_BUCKET_NAME],
      `${key.substr(0, key.lastIndexOf('.'))}.json`
    );

    await readStreamByLine(record.s3.bucket.name, key, line => {
      processLine(line, data => {
        writeStream.write(`${JSON.stringify(data)}\n`);
      });
    });

    writeStream.end();
    const uploadResponse = await uploadPromise;

    console.log(uploadResponse);
  }
};

function processLine(input, callback) {
  // Replace this with your processing logic and pass the processed object to callback
  callback(input);
}
