const { handler } = require('../src/lambdas/getUser/index');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
    const testDocumentClient = {
        get: jest.fn().mockReturnThis(),
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
    test('Gets user by id successfully', async () => {
        const resultBody = { userId: 'mockUserId', name: 'Test User' };
        mdb.get().promise.mockResolvedValueOnce({ Item: resultBody });

        const response = await handler(mockEvent);

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.body)).toStrictEqual(resultBody);
    });

    test('Returns 404 status code if user not found', async () => {
        mdb.get().promise.mockResolvedValueOnce({});

        const response = await handler(mockEvent);

        expect(response).toEqual({
            statusCode: 404,
            body: JSON.stringify({ message: 'User not found.' }),
        });
    });

    test('Handles errors and returns 500 status code', async () => {
        mdb.get().promise.mockRejectedValue(() => {
            throw new Error('Mock DynamoDB Error');
        });

        const response = await handler(mockEvent);

        expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error.' }),
        });
    });
});
