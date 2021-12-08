package com.interview.model.entity;


import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class EmotionDTO {
    private String file;

    private MultipartFile image;
}
