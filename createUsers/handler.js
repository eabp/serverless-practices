const aws = require("aws-sdk");
const { randomUUID } = require("crypto");

let dynamoDBClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamoDBClientParams = {
    region: "localhost",
    endpoint: "http://127.0.0.1:8000",
    credentials: {
      accessKeyId: "MockAccessKeyId",
      secretAccessKey: "MockSecretAccessKey",
    },
  };
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams);

const createUsers = async (event, context) => {
  const id = randomUUID();
  let userBody = {
    pk: id,
    ...JSON.parse(event.body),
  };

  const params = {
    TableName: "usersTable",
    Item: userBody,
  };

  console.log(params);

  return dynamodb
    .put(params)
    .promise()
    .then((result) => {
      return {
        statusCode: 200,
        body: JSON.stringify({
          user: params.Item,
        }),
      };
    });
};

module.exports = {
  createUsers,
};
