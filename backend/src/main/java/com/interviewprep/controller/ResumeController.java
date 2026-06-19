package com.interviewprep.controller;

import com.interviewprep.entity.Resume;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<Resume> upload(@AuthenticationPrincipal UserDetails userDetails,
                                          @RequestParam("file") MultipartFile file) throws Exception {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        return ResponseEntity.ok(resumeService.uploadAndAnalyze(userId, file));
    }

    @GetMapping
    public ResponseEntity<List<Resume>> getMyResumes(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        return ResponseEntity.ok(resumeService.getUserResumes(userId));
    }
}
