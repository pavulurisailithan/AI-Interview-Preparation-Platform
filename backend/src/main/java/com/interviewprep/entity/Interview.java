package com.interviewprep.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interviews")
@Data
@NoArgsConstructor
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private Question.Category category;

    @Enumerated(EnumType.STRING)
    private Question.Difficulty difficulty;

    private Integer totalQuestions;
    private Integer durationMinutes;
    private Double overallScore;

    @Enumerated(EnumType.STRING)
    private Status status = Status.IN_PROGRESS;

    private LocalDateTime startedAt = LocalDateTime.now();
    private LocalDateTime completedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL)
    private List<Result> results;

    public enum Status { IN_PROGRESS, COMPLETED, ABANDONED }
}
