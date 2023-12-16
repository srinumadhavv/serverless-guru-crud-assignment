const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.USER_TABLE;

module.exports.handler = async () => {
  try {
    // Scan the table to get all users
    const params = {
      TableName: TABLE_NAME,
      IndexName: "isDeletedGSI",
      KeyConditionExpression: "isDeleted = :deleted",
      ExpressionAttributeValues: {
        ":deleted": "false",
      },
    };
    console.log("Params", params);
    const { Items } = await dynamoDB.query(params).promise();
    return {
      statusCode: 200,

      body: JSON.stringify(Items),
    };
  } catch (error) {
    console.error("Error getting all users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
