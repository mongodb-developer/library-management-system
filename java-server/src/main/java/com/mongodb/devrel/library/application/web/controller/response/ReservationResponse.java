package com.mongodb.devrel.library.application.web.controller.response;

public record ReservationResponse(
        String message,
        String insertedId
) {}
