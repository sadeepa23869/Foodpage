package com.foodlearning.entity;  //Standard package for entity classes

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data                               //from Lombok (generates getters, setters, toString, etc.)
@Document(collection = "comments")  //Specifies this entity maps to a MongoDB collection named "comments"
public class Comment {
    @Id                        //Marks the field id as the Primary Key
    private String id;
    private String postId;
    private String userId;
    private String content;
    private LocalDateTime createdAt;
}