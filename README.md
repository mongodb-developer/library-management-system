# Library Management System

This is a library management system built with the Spring and Angular.

## Running the project

1. Clone the repository.

    ```
    git clone git@github.com:mongodb-developer/library-management-system.git -b java-server library
    ```

1. Set the MongoDB connection string as an environment variable.

    On Linux/Mac:
    ```
    export MONGODB_URI="<YOUR_CONNECTION_STRING>"
    ```

    On Windows:
    ```
    $env:MONGODB_URI="<YOUR_CONNECTION_STRING>"
    ```

1. Run the Java server.

    ```
    cd java-server
    mvn spring-boot:run
    ```

1. Run the client

    ```
    (cd ../client && npm install && npm start)
    ```

You now have the client running on http://localhost:4200 and the server running on http://localhost:5400.

## Pre-commit hook

The project utilizes [Husky](https://typicode.github.io/husky/) to execute actions before every commit. The pre-commit hook, located in [.husky/pre-commit](./.husky/pre-commit), lints the code and runs the API tests.

Use at your own risk; not a supported MongoDB product