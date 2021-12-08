package com.interview.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class SttEntity {
    private String script;
    private List voice;
    //원본 스크립트와 STT api로 변환된 스크립트를 request로 요청받음.
    //원본 스크립트는 String으로 통채로 오고, 변환된 스크립트는 List형식으로 나누어져서 옴.
}
