const { handler } = require('../src/lambdas/createUser/index'); 
const aws = require('aws-sdk');
jest.mock("aws-sdk");

jest.mock('process', () => ({
    env: {
        USER_TABLE: 'mockUserTable',
    },
}));

jest.mock('aws-sdk', () =>{
    const testDocumentClient = {
        put: jest.fn().mockReturnThis(),
        query: jest.fn().mockReturnThis(),
        promise: jest.fn(),
    };
    const tDynamoDB = { DocumentClient: jest.fn(() => testDocumentClient) };
    return {
        DynamoDB: tDynamoDB
    }
})

const mdb = new aws.DynamoDB.DocumentClient();

// Mock UUID
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mockUserId'),
}));

const mockEvent = {
    body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        phone: '1234567890',
        address: 'Test Address',
    }),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Lambda Function Test', () => {

    test('Creates a new user successfully', async () => {
        const resultBody = { message: "User created successfully." }
        mdb.query().promise.mockResolvedValueOnce({ Items: [] })
        mdb.put().promise.mockResolvedValueOnce({})
        
        const response = await handler(mockEvent)
        expect(response.statusCode).toEqual(201)
        expect(JSON.parse(response.body)).toStrictEqual(resultBody)
        
    });

    test('Returns 409 status code if user already exists', async () => {
        mdb.query().promise.mockResolvedValueOnce({ Items: [{ email: 'test@example.com' }] })

        const response = await handler(mockEvent);

        expect(response).toEqual({
            statusCode: 409,
            body: JSON.stringify({ message: 'User already exists.' }),
        });
    });

    test('Handles errors and returns 500 status code', async () => {
        mdb.query().promise.mockRejectedValue(() => {
            throw new Error('Mock DynamoDB Error');
        });

        const response = await handler(mockEvent);

        expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error.' }),
        });
    });
});
