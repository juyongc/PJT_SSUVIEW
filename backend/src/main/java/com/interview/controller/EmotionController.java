package com.interview.controller;

import com.interview.model.entity.EmotionDTO;
import com.interview.model.entity.EmotionEntity;
import com.interview.model.entity.Test1;
import com.interview.model.response.EvalEmotionRes;
import com.interview.service.EmotionService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;



@Api("감정분석 API")
@RestController
@CrossOrigin(origins = "", allowedHeaders = "*")
public class EmotionController {

    @Autowired
    EmotionService emotionService;

    @PostMapping(value = "/test/interview/face")
//    public ResponseEntity<EvalEmotionRes> getInput(@RequestBody List<MultipartFile> image) throws IOException {
    public ResponseEntity<EvalEmotionRes> getInput(@RequestParam(value="file",required = true)List<MultipartFile> image) throws IOException{
        return ResponseEntity.ok().body(emotionService.emotionResult(image));
    }

    @PostMapping(value = "/test/interview/first")
    public ResponseEntity<String> test1(@RequestParam(value = "file", required = true)String test1)throws  IOException{
        return ResponseEntity.ok().body(test1);
    }
    @PostMapping(value = "/test/interview/second")
    public ResponseEntity<EvalEmotionRes> test2(@RequestParam(value = "file", required = true)List<MultipartFile> image) throws IOException{
        return ResponseEntity.ok().body(emotionService.emotionResult(image));
    }


}