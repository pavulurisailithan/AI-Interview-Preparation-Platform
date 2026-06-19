package com.interviewprep.repository;

import com.interviewprep.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByInterviewId(Long interviewId);
    List<Result> findByInterviewUserId(Long userId);
}
