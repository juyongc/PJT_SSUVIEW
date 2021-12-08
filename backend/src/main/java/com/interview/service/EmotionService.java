package com.interview.service;

import com.interview.model.entity.EmotionDTO;
import com.interview.model.entity.EmotionEntity;
import com.interview.model.response.EvalEmotionRes;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.Blob;
import java.util.List;

import javax.imageio.ImageIO;
import java.io.File;
import java.io.IOException;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.OutputStream;
import java.sql.SQLException;

@Service
@Slf4j
public class EmotionService {


    public static void convertImage(Blob[] blob) {
        BufferedImage bufferedImage = null;
        OutputStream outputStream = null;
        try {
            bufferedImage = ImageIO.read(blob[0].getBinaryStream());

            outputStream = blob[0].setBinaryStream(0);

            RenderedImage renderedImage = (RenderedImage)bufferedImage;

            ImageIO.write(renderedImage, "JPG", outputStream);

        } catch (IOException e) {
            e.printStackTrace();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        catch(IllegalArgumentException e) {
            e.printStackTrace();
        }
        finally {
            try {
                if (outputStream != null) {
                    outputStream.flush();
                    outputStream.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }



    public EvalEmotionRes emotionResult(List<MultipartFile> image) throws IOException{

        //받아온 사진을 파일로 변환해주는 작업.
        //params라는 map에 데이터를 넣어줌. key값은 "file"
        File t = new File("..");
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        for(int i = 0; i < image.size(); i++) {
            String path = t.getCanonicalPath() + "/file" + i;
            File file = new File(path + ".jpg");
            image.get(i).transferTo(file);
            params.add("file", new FileSystemResource("../file" + i + ".jpg"));

            log.debug(image.get(i).getOriginalFilename());
        }

        //헤더에는 Multipart_form_data를 알려줄 수 있는 정보를 넣음
        //그리고 Http통신을 할 때에 전달할 값인 header와 params를 entity객체에 삽입.
        HttpHeaders headers = new HttpHeaders();
//        headers.add("Accept", MediaType.APPLICATION_JSON.toString());   // json 결과 String으로 변환해서 가져오기는 하는데 흠
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.add("Accept", MediaType.APPLICATION_JSON_VALUE);

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(params, headers);

        RestTemplate rt = new RestTemplate();
        ResponseEntity<EmotionEntity> response = null;


        //Flask _server와 통신(entity전송), 결과로 EmotionEntity를 받는다.
        try {
            System.out.println("Server Connection");
            System.out.println(entity);
            System.out.println(EmotionEntity.class);
            response = rt.postForEntity(
                    // ssafy gpu flask URL 주소입니다.
                    "http://k5b103.p.ssafy.io:5000/model",
                    entity,
                    EmotionEntity.class
            );
            System.out.println(response);
            System.out.println("Server Connection End");
            List score = response.getBody().getScore();
            List resultIndex = response.getBody().getPredicted();
            //결과로 score와 resultIndex를 반환
            EvalEmotionRes evalEmotionRes = new EvalEmotionRes(score, resultIndex);
            return evalEmotionRes;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}