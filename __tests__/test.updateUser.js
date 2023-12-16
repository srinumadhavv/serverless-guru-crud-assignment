const { handler } = require('../src/lambdas/updateUser/index');
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
    body: JSON.stringify({
        email: 'newtest@example.com',
        name: 'New Test User',
        phone: '9876543210',
        address: 'New Test Address',
    }),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Lambda Function Test', () => {
    test('Updates user successfully', async () => {
        const resultBody = {
            userId: 'mockUserId',
            email: 'newtest@example.com',
            name: 'New Test User',
            phone: '9876543210',
            address: 'New Test Address',
        };

        mdb.update().promise.mockResolvedValueOnce({ Attributes: resultBody });

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
