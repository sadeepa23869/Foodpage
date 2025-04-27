package com.skillsync.dto;

public class GoogleAuthRequest {
    private String credential; // The Google ID token (JWT) from the frontend

    public GoogleAuthRequest() {}

    public GoogleAuthRequest(String credential) {
        this.credential = credential;
    }

    public String getCredential() {
        return credential;
    }

    public void setCredential(String credential) {
        this.credential = credential;
    }
}
