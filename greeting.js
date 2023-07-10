const aws = require("aws-sdk");

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

const getUsers = async (event, context) => {

  const userId = event.pathParameters.id;

  const params = {
    ExpressionAttributeValues: { ":pk": userId },
    KeyConditionExpression: "pk = :pk",
    TableName: "usersTable",
  };

  return dynamodb
    .query(params)
    .promise()
    .then((result) => {
      return {
        statusCode: 200,
        body: JSON.stringify({
          users: result['Items'],
        }),
      };
    });
};

module.exports = {
  getUsers,
};
