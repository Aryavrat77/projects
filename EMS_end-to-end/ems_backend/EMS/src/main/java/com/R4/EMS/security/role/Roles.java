package com.R4.EMS.security.role;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public enum Roles {

    EMPLOYEE(Set.of(
        Permissions.EMPLOYEE_READ,
        Permissions.EMPLOYEE_CREATE,
        Permissions.EMPLOYEE_UPDATE,
        Permissions.EMPLOYEE_DELETE
    )),
    HR(Set.of(
        Permissions.HR_CREATE,
        Permissions.HR_DELETE,
        Permissions.HR_READ,
        Permissions.HR_UPDATE
    ));

    @Getter
    private final Set<Permissions> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = new java.util.ArrayList<>(getPermissions()
                .stream()
                .map(
                        permission -> new SimpleGrantedAuthority(permission.getPermission())
                )
                .collect(Collectors.toList()));
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
