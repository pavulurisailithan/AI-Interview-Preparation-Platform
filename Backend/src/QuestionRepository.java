package com.interviewprep.repository;

import com.interviewprep.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategoryAndDifficultyAndActiveTrue(Question.Category category, Question.Difficulty difficulty);
    List<Question> findByActiveTrue();

    @Query("SELECT q FROM Question q WHERE q.active = true AND (:category IS NULL OR q.category = :category) AND (:difficulty IS NULL OR q.difficulty = :difficulty)")
    List<Question> findFiltered(@Param("category") Question.Category category, @Param("difficulty") Question.Difficulty difficulty);


}
