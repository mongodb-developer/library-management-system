package com.mongodb.devrel.library.application.web.controller;
import com.mongodb.devrel.library.domain.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.ModelAttribute;

/*
 * Copyright (c) 2025 MongoDB, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0 *
 *
 * Contributors:
 * - Ricardo Mello
 */

public abstract class BaseController {

    @ModelAttribute("loggedInUser")
    public User getLoggedInUser(HttpServletRequest request) {
        return (User) request.getAttribute("loggedInUser");
    }
}
