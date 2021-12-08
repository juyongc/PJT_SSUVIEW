package com.interview.controller;

import com.interview.model.entity.SttEntity;
import com.interview.service.SttService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Api("STT API")
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class SttController {

    @Autowired
    SttService sttService;

    //한국어 stt 스크립트를 받는 restapi
    @PostMapping(value = "test/interview/voice")
    public ResponseEntity<Map> AnalyzeVoiceKr(@RequestBody SttEntity script){
        //SttEntity DTO를 확인하면 어떤 데이터를 받는지 확인 가능
        return ResponseEntity.ok().body(sttService.analyzeVoiceKr(script.getScript(), script.getVoice()));
    }

    //영어 stt 스크립트를 받는 restapi
    @PostMapping(value = "/test/interview/voiceEn")
    public ResponseEntity<Map> AnalyzeVoiceEn(@RequestBody SttEntity script){
        return ResponseEntity.ok().body(sttService.analyzeVoiceEn(script.getScript(), script.getVoice()));
    }

}
