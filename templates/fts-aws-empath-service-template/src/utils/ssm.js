const { SSM } = require('aws-sdk');

const ssm = new SSM();
const getParameters = parameterNames => {
  const params = {
    Names: parameterNames,
    WithDecryption: true,
  };

  return new Promise((resolve, reject) =>
    ssm
      .getParameters(params)
      .promise()
      .then(res =>
        resolve(
          res.Parameters.reduce((obj, param) => {
            obj[param.Name] = param.Value;

            return obj;
          }, {})
        )
      )
      .catch(err => reject(err))
  );
};

module.exports = { getParameters };
