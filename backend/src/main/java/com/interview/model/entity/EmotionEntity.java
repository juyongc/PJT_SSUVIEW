package com.interview.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class EmotionEntity {
    private List score;
    private List predicted;
    //Flask서버에서 score List로 7가지 감정에 대한 각 점수분포를 받아옴
    //predicted가 결과 페이지에 쓰일 자료인데, request로 요청된 사진들의 결과를 List로 넣어서 reponse
    //EvalEmotionRes와 차이점이라면 생성자가 없다.(Getter와 Setter만 존재)
}
