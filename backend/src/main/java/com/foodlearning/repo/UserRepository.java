package com.foodlearning.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.foodlearning.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}
