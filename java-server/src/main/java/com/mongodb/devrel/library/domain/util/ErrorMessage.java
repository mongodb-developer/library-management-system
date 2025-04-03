package com.mongodb.devrel.library.domain.util;

public class ErrorMessage {
    public static final String noDB = """
    
        ####### ######  ######  ####### ######  
        #       #     # #     # #     # #     # 
        #       #     # #     # #     # #     # 
        #####   ######  ######  #     # ######  
        #       #   #   #   #   #     # #   #   
        #       #    #  #    #  #     # #    #  
        ####### #     # #     # ####### #     # 

        Missing database connection string! Open the application.properties file and add your MongoDB connection string to the spring.data.mongodb.uri variable.
    """; 
}
