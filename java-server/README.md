# Library App, Java version

This folder contains the Java implementation of the Library app. Is a Java Spring Boot API that exposes some routes on port 5000 by default. This app has been built to maintain as much compatibility as possible with the original Node Express server (you can have a look at that implementation in `/server`). The goal was to use the same client app for both server implementations.

## Structure

- Main app file: `/java-server/src/main/java/com/mongodb/devrel/library/LibraryApplication.java`
- Config file: `/java-server/src/main/resources/.env`
- Routes / Controllers: defined in the `controllers` folder.
- Services: used by the Controllers to access data, they do the heavy lifting
- Repositories: MongoDB repositories to access our database
- Model: model classes for our app

## Reference

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.4.1/maven-plugin)
* [Create an OCI image](https://docs.spring.io/spring-boot/3.4.1/maven-plugin/build-image.html)
* [Spring Web](https://docs.spring.io/spring-boot/3.4.1/reference/web/servlet.html)
* [Spring Data MongoDB](https://docs.spring.io/spring-boot/3.4.1/reference/data/nosql.html#data.nosql.mongodb)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/3.4.1/reference/using/devtools.html)

### Running the application
Open the root folder and run:

`MONGO_DB_URI=<YOUR_CONNECTION_STRING> mvn spring-boot:run`

### Guides
The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Accessing Data with MongoDB](https://spring.io/guides/gs/accessing-data-mongodb/)

### Maven Parent overrides

Due to Maven's design, elements are inherited from the parent POM to the project POM.
While most of the inheritance is fine, it also inherits unwanted elements like `<license>` and `<developers>` from the parent.
To prevent this, the project POM contains empty overrides for these elements.
If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.

