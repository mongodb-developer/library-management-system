package com.mongodb.devrel.library.application.web.controller;
import com.mongodb.devrel.library.domain.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.ModelAttribute;

public abstract class BaseController {

    @ModelAttribute("loggedInUser")
    public User getLoggedInUser(HttpServletRequest request) {
        return (User) request.getAttribute("loggedInUser");
    }
}
