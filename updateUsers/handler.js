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

const updateUsers = async (event, context) => {
  const userId = event.pathParameters.id;

  let body = {
    ...JSON.parse(event.body),
  };

  const params = {
    TableName: "usersTable",
    Key: { pk: userId },
    UpdateExpression: "set #name = :name, #phone = :phone, #country = :country",
    ExpressionAttributeNames: {
      "#name": "name",
      "#phone": "phone",
      "#country": "country",
    },
    ExpressionAttributeValues: {
      ":name": body.name,
      ":phone": body.phone,
      ":country": body.country,
    },
    ReturnValues: "ALL_NEW",
  };

  console.log(params);

  return dynamodb
    .update(params)
    .promise()
    .then((res) => {
      return {
        statusCode: 200,
        body: JSON.stringify({
          user: res.Attributes,
        }),
      };
    });
};

module.exports = {
  updateUsers,
};
