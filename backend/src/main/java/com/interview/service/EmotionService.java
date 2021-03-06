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

        //????????? ????????? ????????? ??????????????? ??????.
        //params?????? map??? ???????????? ?????????. key?????? "file"
        File t = new File("..");
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        for(int i = 0; i < image.size(); i++) {
            String path = t.getCanonicalPath() + "/file" + i;
            File file = new File(path + ".jpg");
            image.get(i).transferTo(file);
            params.add("file", new FileSystemResource("../file" + i + ".jpg"));

            log.debug(image.get(i).getOriginalFilename());
        }

        //???????????? Multipart_form_data??? ????????? ??? ?????? ????????? ??????
        //????????? Http????????? ??? ?????? ????????? ?????? header??? params??? entity????????? ??????.
        HttpHeaders headers = new HttpHeaders();
//        headers.add("Accept", MediaType.APPLICATION_JSON.toString());   // json ?????? String?????? ???????????? ??????????????? ????????? ???
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.add("Accept", MediaType.APPLICATION_JSON_VALUE);

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(params, headers);

        RestTemplate rt = new RestTemplate();
        ResponseEntity<EmotionEntity> response = null;


        //Flask _server??? ??????(entity??????), ????????? EmotionEntity??? ?????????.
        try {
            System.out.println("Server Connection");
            System.out.println(entity);
            System.out.println(EmotionEntity.class);
            response = rt.postForEntity(
                    // ssafy gpu flask URL ???????????????.
                    "http://k5b103.p.ssafy.io:5000/model",
                    entity,
                    EmotionEntity.class
            );
            System.out.println(response);
            System.out.println("Server Connection End");
            List score = response.getBody().getScore();
            List resultIndex = response.getBody().getPredicted();
            //????????? score??? resultIndex??? ??????
            EvalEmotionRes evalEmotionRes = new EvalEmotionRes(score, resultIndex);
            return evalEmotionRes;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}