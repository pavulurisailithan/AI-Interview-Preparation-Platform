package com.interviewprep.controller;

import com.interviewprep.dto.AnswerSubmitRequest;
import com.interviewprep.entity.*;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final UserRepository userRepository;

    @PostMapping("/start")
    public ResponseEntity<Interview> start(@AuthenticationPrincipal UserDetails userDetails,
                                            @RequestBody Map<String, Object> body) {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        String category = (String) body.get("category");
        String difficulty = (String) body.get("difficulty");
        int count = body.get("questionCount") != null ? (int) body.get("questionCount") : 5;
        return ResponseEntity.ok(interviewService.startInterview(userId, category, difficulty, count));
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<List<Question>> getQuestions(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterviewQuestions(id));
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<Result> submitAnswer(@PathVariable Long id,
                                                @RequestBody AnswerSubmitRequest req) {
        return ResponseEntity.ok(interviewService.submitAnswer(id, req));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Interview> complete(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.completeInterview(id));
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<List<Result>> getResults(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterviewResults(id));
    }

    @GetMapping("/{id}/feedback")
    public ResponseEntity<Feedback> getFeedback(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterviewFeedback(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Interview>> getMyInterviews(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        return ResponseEntity.ok(interviewService.getUserInterviews(userId));
    }
}
