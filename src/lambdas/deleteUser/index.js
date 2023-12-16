const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.USER_TABLE;

module.exports.handler = async (event) => {
  try {
    const { userId } = event.pathParameters;

    // Delete the user
    const params = {
        TableName: TABLE_NAME,
        Key: {
          userId,
        },
        UpdateExpression: 'SET isDeleted = :isDeleted',
        ExpressionAttributeValues: {
          ':isDeleted':'true',
        },
      };
    console.log("Params", params);
    await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User deleted successfully." }),
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
