package com.interviewprep.dto;

import lombok.Data;
import java.util.Map;

@Data
public class DashboardStats {
    private long totalInterviews;
    private long completedInterviews;
    private Double averageScore;
    private Map<String, Double> scoreByCategory;
    private Map<String, Long> interviewsByDifficulty;
    private java.util.List<ScoreEntry> recentScores;

    @Data
    public static class ScoreEntry {
        private String date;
        private Double score;
        private String category;
    }
}
