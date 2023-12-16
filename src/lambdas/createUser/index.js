const AWS = require("aws-sdk");
const uuid = require("uuid");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.USER_TABLE;

module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { email, name, phone, address } = requestBody;

    // Generate a unique user_id using uuid
    const userId = uuid.v4();

    // Create a new user
    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId,
        email,
        name,
        phone,
        address,
        isDeleted: "false",
      },
    };
    const params2 = {
      TableName: TABLE_NAME,
      IndexName: "EmailGSI", // Assuming you have a Global Secondary Index named 'EmailIndex'
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const result = await dynamoDB.query(params2).promise();

    if (result.Items.length !== 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "User already exists." }),
      };
    }

    await dynamoDB.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User created successfully." }),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
