package com.interviewprep.repository;

import com.interviewprep.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUserIdOrderByStartedAtDesc(Long userId);
    List<Interview> findByUserIdAndStatus(Long userId, Interview.Status status);

    @Query("SELECT AVG(i.overallScore) FROM Interview i WHERE i.user.id = :userId AND i.status = 'COMPLETED'")
    Double findAvgScoreByUserId(@Param("userId") Long userId);

    long countByUserIdAndStatus(Long userId, Interview.Status status);
}
