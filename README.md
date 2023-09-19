# Library Management System

This is a library management system built with the MEAN (MongoDB, Express, Angular, Node.js) stack. 

## Running the project

1. Clone the repository.

    ```
    git clone git@github.com:mongodb-developer/library-management-system.git library
    ```

1. Install the dependencies in the root level of the project.

    **library/**
    ```
    npm install
    ```

1.  Set your [Atlas URI connection string](https://docs.atlas.mongodb.com/getting-started/), database name and server port in `server/.env`. Make sure you replace the username and password placeholders with your own credentials.

    **library/server/.env**
    ```
    PORT="5000"
    DATABASE_URI="mongodb+srv://<username>:<password>@m0.kwqkoewm.mongodb.net"
    DATABASE_NAME="library"
    SECRET="secret"
    ```


1. Start the **server** application.

    **library/server/**
    ```
    npm install && npm start
    ```

1. Open a new terminal window and start the **client** application.

    **library/client/**
    ```
    npm install && npm start
    ```

1. When both applications are built and running, open your browser on http://localhost:4200/.

## Executing the tests

Currently, the project has only API tests implemented with [`supertest`](https://www.npmjs.com/package/supertest) and [`mocha`](https://www.npmjs.com/package/mocha). To execute them, navigate to the `server/` directory and run:

**library/server/**
```
npm test
```

## Pre-commit hook

The project utilizes [Husky](https://typicode.github.io/husky/) to execute actions before every commit. The pre-commit hook, located in [.husky/pre-commit](./.husky/pre-commit), lints the code and runs the API tests.

Use at your own risk; not a supported MongoDB product
