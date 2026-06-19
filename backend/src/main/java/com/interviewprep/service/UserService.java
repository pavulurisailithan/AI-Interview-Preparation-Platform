package com.interviewprep.service;

import com.interviewprep.entity.User;
import com.interviewprep.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getProfile(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    public User updateProfile(String email, User updates) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (updates.getFullName() != null) user.setFullName(updates.getFullName());
        if (updates.getPhone() != null) user.setPhone(updates.getPhone());
        return userRepository.save(user);
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (!passwordEncoder.matches(oldPassword, user.getPassword()))
            throw new RuntimeException("Invalid current password");
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
