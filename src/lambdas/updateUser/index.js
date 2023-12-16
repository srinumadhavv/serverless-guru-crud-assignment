const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.USER_TABLE;

module.exports.handler = async (event) => {
  try {
    const { userId } = event.pathParameters;
    const requestBody = JSON.parse(event.body);
    const { email, name, phone, address } = requestBody;
    const expectedParams = ['email', 'name', 'phone', 'address'];
    let updateExpression = 'SET ';
    for (const param of expectedParams) {
      if (requestBody[param]) {
        if(param === 'name') {
          updateExpression += `#name = :${param}, `;
        } else {
        updateExpression += `${param} = :${param}, `;
      }
    }
}
    updateExpression = updateExpression.slice(0, -2); // Remove the last comma and space
    // Update the user  
    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: {
        ':email': email,
        ':name': name,
        ':phone': phone,
        ':address': address,
      },
      ExpressionAttributeNames: {
        '#name': 'name', // 'name' is a reserved keyword in DynamoDB, so using ExpressionAttributeNames to alias it
      },
      ReturnValues: 'ALL_NEW', // Return the updated item
    };

    const result = await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};
