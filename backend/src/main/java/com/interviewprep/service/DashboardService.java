package com.interviewprep.service;

import com.interviewprep.dto.DashboardStats;
import com.interviewprep.entity.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InterviewRepository interviewRepository;
    private final ResultRepository resultRepository;

    public DashboardStats getStats(Long userId) {
        List<Interview> interviews = interviewRepository.findByUserIdOrderByStartedAtDesc(userId);
        long completed = interviews.stream().filter(i -> i.getStatus() == Interview.Status.COMPLETED).count();

        DashboardStats stats = new DashboardStats();
        stats.setTotalInterviews(interviews.size());
        stats.setCompletedInterviews(completed);
        stats.setAverageScore(interviewRepository.findAvgScoreByUserId(userId));

        // Score by category
        Map<String, Double> byCat = interviews.stream()
                .filter(i -> i.getOverallScore() != null)
                .collect(Collectors.groupingBy(i -> i.getCategory().name(), Collectors.averagingDouble(Interview::getOverallScore)));
        stats.setScoreByCategory(byCat);

        // By difficulty
        Map<String, Long> byDiff = interviews.stream()
                .collect(Collectors.groupingBy(i -> i.getDifficulty().name(), Collectors.counting()));
        stats.setInterviewsByDifficulty(byDiff);

        // Recent scores (last 10)
        List<DashboardStats.ScoreEntry> recent = interviews.stream()
                .filter(i -> i.getOverallScore() != null)
                .limit(10)
                .map(i -> {
                    DashboardStats.ScoreEntry e = new DashboardStats.ScoreEntry();
                    e.setDate(i.getCompletedAt() != null ? i.getCompletedAt().toLocalDate().toString() : "");
                    e.setScore(i.getOverallScore());
                    e.setCategory(i.getCategory().name());
                    return e;
                }).collect(Collectors.toList());
        stats.setRecentScores(recent);
        return stats;
    }
}
