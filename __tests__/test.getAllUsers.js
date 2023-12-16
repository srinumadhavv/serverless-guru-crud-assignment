const { handler } = require('../src/lambdas/getAllUsers/index');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
    const testDocumentClient = {
        query: jest.fn().mockReturnThis(),
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

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Lambda Function Test', () => {
    test('Gets all users successfully', async () => {
        const resultBody = [{ userId: 'mockUserId', name: 'Test User' }];
        mdb.query().promise.mockResolvedValueOnce({ Items: resultBody });

        const response = await handler();

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.body)).toStrictEqual(resultBody);
    });

    test('Handles errors and returns 500 status code', async () => {
        mdb.query().promise.mockRejectedValue(() => {
            throw new Error('Mock DynamoDB Error');
        });

        const response = await handler();

        expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error.' }),
        });
    });
});
