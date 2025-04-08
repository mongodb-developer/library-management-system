package com.mongodb.devrel.library.application.web.controller.response;

import com.mongodb.devrel.library.domain.model.IssueDetail;

import java.util.List;

public record BorrowedBookResponse(
        List<IssueDetail> data
) {}
