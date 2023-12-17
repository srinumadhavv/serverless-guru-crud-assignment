# User Management APIs with Serverless Framework and AWS
This project implements a Serverless Framework REST API using AWS services for user management. The API supports CRUD functionality (Create, Read, Update, Delete) for user records stored in DynamoDB. The CI/CD pipeline is set up using GitHub Actions, deploying to multiple stages such as dev and prod. 

### Project Structure
The project is organized into the following components:
```
├── __tests__
│  ├── test.createUser.js
│  ├── test.deleteUser.js
│  ├── test.getAllUsers.js
│  ├── test.getUser.js
│  └── test.updateUser.js
├── .gitignore
├── jest.config.js
├── layers
│  └── nodejs.zip
├── package-lock.json
├── package.json
├── README.md
├── resources
│  ├── dynamodb.yml
│  └── lambda.yml
├── serverless.yml
└── src
  └── lambdas
    ├── createUser
    │  └── index.js
    ├── deleteUser
    │  └── index.js
    ├── getAllUsers
    │  └── index.js
    ├── getUser
    │  └── index.js
    └── updateUser
      └── index.js
```
- **Serverless Framework Config**: The serverless.yml file contains the configuration for the Serverless Framework, defining AWS resources and functions.
- **Lambda Functions**: There are 5 Lambda functions, each responsible for a CRUD operation. These functions are implemented in Node.js.
- **GitHub Actions Workflow**: The .github/workflows/main.yml file contains the GitHub Actions workflow for CI/CD.
- **Tests**: The tests directory contains unit tests for the Lambda functions.
- **Resources**: The resources directory contains the resources (infrastructure) to be deployed in cloud.

### Getting Started

#### Prerequisites

- Node.js and npm installed.
- Serverless Framework CLI installed (npm install -g serverless).

#### Installation

1. Clone Repository
```
git clone <repository-url>

```
2. Install Dependencies
```
npm install
```

### Deploying the API

Deploy the application to the dev stage:

```
serverless deploy --stage dev
```

For production deployment:

```
serverless deploy --stage prod
```

### CI/CD Pipeline
The CI/CD pipeline is set up using GitHub Actions. On every push to the master branch,Prod the workflow is triggered. The workflow includes steps for testing, and deployment.

![devcicd](https://github.com/srinumadhavv/serverless-guru-crud-assignment/assets/43718077/4cc47980-fe07-4dd1-9554-ab48c9a04c9f)
![prod-cicd](https://github.com/srinumadhavv/serverless-guru-crud-assignment/assets/43718077/8cc18cc7-bc64-4cc2-9960-6d062f90c684)

### API URL
If you want to use the APIs and test in postman use the below API:

```
DEV: https://cyz3m4frrl.execute-api.us-east-1.amazonaws.com/dev
PROD: https://gh761wl0h5.execute-api.us-east-1.amazonaws.com/prod/
```
### Demo
For a detailed walkthrough of the code, infrastructure, and additional features, please watch the demo video on Loom.

### Additional Notes

- **Lambda Packaging**: Lambda functions are packaged to include only necessary dependencies to reduce deployment size.

- **YAML Organization**: The serverless.yml file is organized with clear sections for each AWS resource and function.

- **Testing**: Unit tests can be found in the tests directory.

![tests](https://github.com/srinumadhavv/serverless-guru-crud-assignment/assets/43718077/e3c191cb-443c-4f11-b8a4-c328c56cfbb3)
