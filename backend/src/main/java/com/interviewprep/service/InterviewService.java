package com.interviewprep.service;

import com.interviewprep.dto.AnswerSubmitRequest;
import com.interviewprep.entity.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final ResultRepository resultRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public Interview startInterview(Long userId, String category, String difficulty, int questionCount) {
        User user = userRepository.findById(userId).orElseThrow();
        Question.Category cat = Question.Category.valueOf(category.toUpperCase());
        Question.Difficulty diff = Question.Difficulty.valueOf(difficulty.toUpperCase());

        Interview interview = new Interview();
        interview.setUser(user);
        interview.setCategory(cat);
        interview.setDifficulty(diff);
        interview.setTotalQuestions(questionCount);
        interview.setDurationMinutes(questionCount * 3);
        return interviewRepository.save(interview);
    }

    public List<Question> getInterviewQuestions(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId).orElseThrow();
        List<Question> all = questionRepository.findByCategoryAndDifficultyAndActiveTrue(
                interview.getCategory(), interview.getDifficulty());
        Collections.shuffle(all);
        return all;
    }

    public Result submitAnswer(Long interviewId, AnswerSubmitRequest req) {
        Interview interview = interviewRepository.findById(interviewId).orElseThrow();
        Question question = questionRepository.findById(req.getQuestionId()).orElseThrow();

        double score = evaluateAnswer(req.getUserAnswer(), question);
        String matched = findMatchedKeywords(req.getUserAnswer(), question.getKeywords());
        String feedback = generateAnswerFeedback(score, matched);

        Result result = new Result();
        result.setInterview(interview);
        result.setQuestion(question);
        result.setUserAnswer(req.getUserAnswer());
        result.setScore(score);
        result.setTimeTakenSeconds(req.getTimeTakenSeconds());
        result.setFeedback(feedback);
        result.setMatchedKeywords(matched);
        return resultRepository.save(result);
    }

    public Interview completeInterview(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId).orElseThrow();
        List<Result> results = resultRepository.findByInterviewId(interviewId);

        double avg = results.stream().mapToDouble(Result::getScore).average().orElse(0.0);
        interview.setOverallScore(Math.round(avg * 100.0) / 100.0);
        interview.setStatus(Interview.Status.COMPLETED);
        interview.setCompletedAt(LocalDateTime.now());
        Interview saved = interviewRepository.save(interview);

        generateAndSaveFeedback(saved, results);
        return saved;
    }

    private double evaluateAnswer(String userAnswer, Question question) {
        if (userAnswer == null || userAnswer.isBlank()) return 0.0;
        String lower = userAnswer.toLowerCase();
        String expected = question.getExpectedAnswer() != null ? question.getExpectedAnswer().toLowerCase() : "";
        String keywords = question.getKeywords() != null ? question.getKeywords().toLowerCase() : "";

        long matched = Arrays.stream(keywords.split(","))
                .map(String::trim).filter(k -> !k.isEmpty() && lower.contains(k)).count();
        long total = Arrays.stream(keywords.split(",")).map(String::trim).filter(k -> !k.isEmpty()).count();

        double keywordScore = total > 0 ? (double) matched / total * 70 : 0;
        double lengthScore = Math.min(userAnswer.length() / 50.0 * 30, 30);
        return Math.min(Math.round((keywordScore + lengthScore) * 10.0) / 10.0, 100.0);
    }

    private String findMatchedKeywords(String answer, String keywords) {
        if (answer == null || keywords == null) return "";
        String lower = answer.toLowerCase();
        return Arrays.stream(keywords.split(","))
                .map(String::trim).filter(k -> !k.isEmpty() && lower.contains(k.toLowerCase()))
                .collect(Collectors.joining(", "));
    }

    private String generateAnswerFeedback(double score, String matched) {
        if (score >= 80) return "Excellent answer! Covered: " + matched;
        if (score >= 60) return "Good answer. Key points covered: " + matched + ". Could be more detailed.";
        if (score >= 40) return "Partial answer. Try to include more keywords and examples.";
        return "Answer needs improvement. Study the topic more thoroughly.";
    }

    private void generateAndSaveFeedback(Interview interview, List<Result> results) {
        Map<String, Double> topicScores = results.stream()
                .collect(Collectors.groupingBy(r -> r.getQuestion().getTopic() != null ? r.getQuestion().getTopic() : "General",
                        Collectors.averagingDouble(Result::getScore)));

        String strong = topicScores.entrySet().stream()
                .filter(e -> e.getValue() >= 70).map(Map.Entry::getKey).collect(Collectors.joining(", "));
        String weak = topicScores.entrySet().stream()
                .filter(e -> e.getValue() < 50).map(Map.Entry::getKey).collect(Collectors.joining(", "));

        Feedback fb = new Feedback();
        fb.setInterview(interview);
        fb.setStrongAreas(strong.isEmpty() ? "Keep practicing!" : strong);
        fb.setWeakAreas(weak.isEmpty() ? "No major weak areas" : weak);
        fb.setOverallFeedback(buildOverallFeedback(interview.getOverallScore()));
        fb.setImprovementSuggestions(buildSuggestions(weak));
        feedbackRepository.save(fb);
    }

    private String buildOverallFeedback(Double score) {
        if (score >= 80) return "Outstanding performance! You are well prepared.";
        if (score >= 60) return "Good performance. A bit more practice will make you interview-ready.";
        if (score >= 40) return "Average performance. Focus on weak areas and practice more.";
        return "Needs significant improvement. Review the topics and try again.";
    }

    private String buildSuggestions(String weakAreas) {
        if (weakAreas == null || weakAreas.isBlank()) return "Keep maintaining your strong areas.";
        return "Focus on: " + weakAreas + ". Practice with more mock interviews.";
    }

    public List<Interview> getUserInterviews(Long userId) {
        return interviewRepository.findByUserIdOrderByStartedAtDesc(userId);
    }

    public Feedback getInterviewFeedback(Long interviewId) {
        return feedbackRepository.findByInterviewId(interviewId).orElse(null);
    }

    public List<Result> getInterviewResults(Long interviewId) {
        return resultRepository.findByInterviewId(interviewId);
    }
}
