package com.interviewprep.service;

import com.interviewprep.entity.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final InterviewRepository interviewRepository;

    public List<User> getAllUsers() { return userRepository.findAll(); }

    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }

    public void deleteUser(Long userId) { userRepository.deleteById(userId); }

    public List<Question> getAllQuestions() { return questionRepository.findAll(); }

    public Question saveQuestion(Question question) { return questionRepository.save(question); }

    public void deleteQuestion(Long id) { questionRepository.deleteById(id); }

    public Map<String, Object> getPlatformStats() {
        return Map.of(
            "totalUsers", userRepository.count(),
            "totalQuestions", questionRepository.count(),
            "totalInterviews", interviewRepository.count(),
            "completedInterviews", interviewRepository.findAll().stream()
                .filter(i -> i.getStatus() == Interview.Status.COMPLETED).count()
        );
    }
}
