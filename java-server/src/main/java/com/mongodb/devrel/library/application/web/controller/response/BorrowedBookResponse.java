package com.mongodb.devrel.library.application.web.controller.response;

import com.mongodb.devrel.library.domain.model.IssueDetail;
import java.util.List;

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

public record BorrowedBookResponse(
        List<IssueDetail> data
) {
}
