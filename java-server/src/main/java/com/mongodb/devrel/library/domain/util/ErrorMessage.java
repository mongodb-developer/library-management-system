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
        
        Missing database connection string!
                
        To fix this, set the environment variable before starting the app:
                
        export MONGODB_URI="<YOUR_CONNECTION_STRING>"
                
        Then run your application again.             

    """;
}
