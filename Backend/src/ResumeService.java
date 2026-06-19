package com.interviewprep.service;

import com.interviewprep.entity.*;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final List<String> SKILL_KEYWORDS = Arrays.asList(
        "java", "python", "javascript", "typescript", "react", "angular", "vue", "spring", "springboot",
        "node", "nodejs", "sql", "mysql", "postgresql", "mongodb", "redis", "docker", "kubernetes",
        "aws", "azure", "gcp", "git", "html", "css", "bootstrap", "tailwind", "rest", "api",
        "microservices", "hibernate", "maven", "gradle", "junit", "testing", "agile", "scrum",
        "c++", "c#", "go", "rust", "kotlin", "swift", "flutter", "android", "ios", "linux"
    );

    public Resume uploadAndAnalyze(Long userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId).orElseThrow();

        // Save file
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = dir.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Extract text
        String text = extractText(filePath.toFile());

        // Analyze
        List<String> skills = extractSkills(text);
        int atsScore = calculateAtsScore(text, skills);
        String suggestions = generateSuggestions(text, skills, atsScore);

        Resume resume = new Resume();
        resume.setUser(user);
        resume.setFileName(file.getOriginalFilename());
        resume.setFilePath(filePath.toString());
        resume.setExtractedText(text);
        resume.setSkills(String.join(", ", skills));
        resume.setAtsScore(atsScore);
        resume.setSuggestions(suggestions);

        return resumeRepository.save(resume);
    }

    private String extractText(File file) throws IOException {
        try (PDDocument doc = Loader.loadPDF(file)) {
            return new PDFTextStripper().getText(doc);
        }
    }

    private List<String> extractSkills(String text) {
        String lower = text.toLowerCase();
        List<String> found = new ArrayList<>();
        for (String skill : SKILL_KEYWORDS) {
            if (lower.contains(skill)) found.add(skill.toUpperCase());
        }
        return found;
    }

    private int calculateAtsScore(String text, List<String> skills) {
        int score = 0;
        String lower = text.toLowerCase();
        if (lower.contains("experience")) score += 15;
        if (lower.contains("education")) score += 10;
        if (lower.contains("project")) score += 15;
        if (lower.contains("skill")) score += 10;
        if (lower.contains("certification")) score += 10;
        if (lower.contains("achievement") || lower.contains("accomplishment")) score += 10;
        score += Math.min(skills.size() * 2, 30);
        return Math.min(score, 100);
    }

    private String generateSuggestions(String text, List<String> skills, int score) {
        List<String> tips = new ArrayList<>();
        String lower = text.toLowerCase();
        if (!lower.contains("summary") && !lower.contains("objective")) tips.add("Add a professional summary/objective section");
        if (!lower.contains("project")) tips.add("Include a Projects section with descriptions");
        if (!lower.contains("certification")) tips.add("Add relevant certifications to boost ATS score");
        if (skills.size() < 5) tips.add("List more technical skills");
        if (text.length() < 500) tips.add("Resume seems too short, add more details");
        if (score < 60) tips.add("Use more industry keywords relevant to your target role");
        return String.join(" | ", tips.isEmpty() ? List.of("Resume looks good!") : tips);
    }

    public List<Resume> getUserResumes(Long userId) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(userId);
    }
}
