package com.R4.EMS.security.role;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permissions {

    HR_READ("hr:read"),
    HR_UPDATE("hr:update"),
    HR_CREATE("hr:create"),
    HR_DELETE("hr:delete"),
    EMPLOYEE_READ("employee:read"),
    EMPLOYEE_UPDATE("employee:update"),
    EMPLOYEE_CREATE("employee:create"),
    EMPLOYEE_DELETE("employee:delete");

    @Getter
    private final String permission;
}
