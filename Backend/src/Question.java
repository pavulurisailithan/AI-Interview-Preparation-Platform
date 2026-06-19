package com.interviewprep.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String expectedAnswer;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private String topic;
    private boolean active = true;

    @Column(columnDefinition = "TEXT")
    private String keywords;

    public enum Category { TECHNICAL, HR, BEHAVIORAL }
    public enum Difficulty { EASY, MEDIUM, HARD }
}
