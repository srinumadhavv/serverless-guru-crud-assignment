const { handler } = require('../src/lambdas/deleteUser/index');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
    const testDocumentClient = {
        update: jest.fn().mockReturnThis(),
        promise: jest.fn(),
    };
    const tDynamoDB = { DocumentClient: jest.fn(() => testDocumentClient) };
    return {
        DynamoDB: tDynamoDB,
    };
});

jest.mock('process', () => ({
    env: {
        USER_TABLE: 'mockUserTable',
    },
}));

const mdb = new AWS.DynamoDB.DocumentClient();

const mockEvent = {
    pathParameters: {
        userId: 'mockUserId',
    },
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Lambda Function Test', () => {
    test('Deletes a user successfully', async () => {
        const resultBody = { message: 'User deleted successfully.' };
        mdb.update().promise.mockResolvedValueOnce({});

        const response = await handler(mockEvent);

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.body)).toStrictEqual(resultBody);
    });

    test('Handles errors and returns 500 status code', async () => {
        mdb.update().promise.mockRejectedValue(() => {
            throw new Error('Mock DynamoDB Error');
        });

        const response = await handler(mockEvent);

        expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error.' }),
        });
    });
});
