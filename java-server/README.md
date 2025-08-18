# Library App (Java, Spring Boot)

This is the Java backend implementation of the Library App.  
It is a **Spring Boot REST API** that connects to **MongoDB** and exposes routes for managing books, users, and library operations.

## 🛠️ Technologies Used
- **Java 21**
- **Spring Boot 3.4.5**
    - Spring Web (REST API)
    - Spring Data MongoDB (database access)
    - Spring Security (basic security and JWT support)
- **MongoDB Atlas / Local MongoDB**
- **Maven** (build and dependency management)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mongodb-developer/library-management-system.git
cd library-management-system/java-server
```

### 2. Set up environment variables

The app requires a MongoDB connection string.
On Linux / macOS
```
export MONGODB_URI="<YOUR_CONNECTION_STRING>"
```

On Windows
```
$env:MONGODB_URI="<YOUR_CONNECTION_STRING>"
```

###  3. Run the application
```
mvn spring-boot:run
```

### 4. Access the API

The application will start on port 8080 by default:
```
http://localhost:8080
```
 
