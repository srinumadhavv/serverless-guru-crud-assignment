const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.USER_TABLE;

module.exports.handler = async (event) => {
  try {
    const { userId } = event.pathParameters;

    // Get user by user_id
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userId: userId ,
          }
    }
    
    const result = await dynamoDB.get(params).promise();
    console.log('result', result);
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error('Error getting user by id:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};

