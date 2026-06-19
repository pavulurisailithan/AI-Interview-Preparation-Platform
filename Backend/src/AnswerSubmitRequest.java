package com.interviewprep.dto;

import lombok.Data;

@Data
public class AnswerSubmitRequest {
    private Long questionId;
    private String userAnswer;
    private Integer timeTakenSeconds;
}
