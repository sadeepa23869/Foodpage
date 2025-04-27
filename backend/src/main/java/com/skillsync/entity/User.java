package com.skillsync.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Document(collection = "user")
public class User implements UserDetails {

    private String id;
    @NotBlank(message = "Email is required")
    private String email;
    private String name;
    private String password;
    private String bio;
    private String photo;

    private List<FollowInfo> followers = new ArrayList<>();
    private List<FollowInfo> following = new ArrayList<>();
    private List<String> learningPlanIds = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                ", bio='" + bio + '\'' +
                ", photo='" + photo + '\'' +
                ", followers=" + followers +
                ", following=" + following +
                ", learningPlanIds=" + learningPlanIds +
                '}';
    }
}
