package com.skillsync.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String message;

    private String email;
    private String name;
}
