package com.interview.service;

import org.springframework.stereotype.Service;

import java.sql.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SttService {

    //2개 String의 유사도를 구하는 메소드 식임
    //두개의 String이 비슷할수록 1.0에 가까운 결과를 보여주고 아닐수록 0.0에 가까운 결과를 반환해줌.
    private double similarity(String s1, String s2) {
        String longer = s1, shorter = s2;

        if (s1.length() < s2.length()) {
            longer = s2;
            shorter = s1;
        }

        int longerLength = longer.length();
        if (longerLength == 0) return 1.0;
        return (longerLength - editDistance(longer, shorter)) / (double) longerLength;
    }

    private int editDistance(String s1, String s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        int[] costs = new int[s2.length() + 1];

        for (int i = 0; i <= s1.length(); i++) {
            int lastValue = i;
            for (int j = 0; j <= s2.length(); j++) {
                if (i == 0) {
                    costs[j] = j;
                } else {
                    if (j > 0) {
                        int newValue = costs[j - 1];

                        if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        }

                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }

            if (i > 0) costs[s2.length()] = lastValue;
        }

        return costs[s2.length()];
    }

    public Map analyzeVoiceKr(String script, List voice){
        StringBuilder sb = new StringBuilder();
        System.out.println(script);
        String[] scriptArray = script.split(" ");

        //원본 스크립트 " "을 잘라서 List에 분배
        for(int i = 0; i < scriptArray.length; i++){
            scriptArray[i] = scriptArray[i].replace(".", "");
        }
        //.도 빼준다
        List<String> voiceArray = new ArrayList<>();
        for(int i = 0; i < voice.size(); i++){
            String[] temp = voice.get(i).toString().split(" ");
            for(String t : temp){
                voiceArray.add(t);
            }
        }

        boolean check = false;
        int indexTemp = 0;

        for(int i = 0; i < scriptArray.length; i++){
            int idx = indexTemp;
            while(idx < voiceArray.size() && idx < scriptArray.length && idx < i+3){
                if(scriptArray[i].length() >= voiceArray.get(idx).length()){
//                    System.out.println("if 들어오는 것 : " + scriptArray[i] + "/" + voiceArray.get(idx));
                    // 첫번째 유사도 확인
                    if(similarity(scriptArray[i], voiceArray.get(idx)) > 0.6){
                        //유사도를 판단해서 비슷한지 아닌지 판단, 어느정도 유사하면 틀리다고 처리안하고 넘어감.
//                        System.out.println("첫째 "+ scriptArray[i] + "/" + voiceArray.get(idx));
                        indexTemp++;
                        break;
                    }
                    else{
                        //유사도가 낮으면 , 원본스크립트는 ex)뽑아 주신다면  변환 스크립트는 ex)뽑아주신다면 처럼
                        //" " 공백차이때문일수도 있기때문에 이러한 상황을 판단해봄.
                        if(idx + 1 < voiceArray.size()) {
                            String temp = voiceArray.get(idx) + voiceArray.get(idx + 1);
                            // 두번째 유사도 확인 - 공백으로 인한 문제일 수 있으니 다음 문자열과 합한 뒤 테스트하는 형식
                            if (similarity(scriptArray[i], temp) > 0.6) {
                                check = true;
                                voiceArray.set(idx , voiceArray.get(idx) + voiceArray.get(idx+1));
                                voiceArray.remove(idx + 1);
//                                System.out.println("둘째 : " + scriptArray[i] + "/" + temp);
                                indexTemp++;
                                break;
                            }
                            else {
                                sb.append(idx+" ");
//                            	sb.append(voiceArray.get(idx)+" ");
                                indexTemp++;
//                                System.out.println("마지막 실패 : " + scriptArray[idx] + "/" + voiceArray.get(idx));
                                break;
                            }
                        }else {	// 인덱스 개수가 같을 때 빠져나갈 방법이 없음 => 만들어 주기
                            sb.append(idx+" ");
//                        	sb.append(voiceArray.get(idx)+" ");
                            indexTemp++;
//                            System.out.println("마지막 실패 : " + scriptArray[idx] + "/" + voiceArray.get(idx));
                            break;
                        }
                    }
                }else{
//                    System.out.println("else 들어오는 것 : " + scriptArray[i] + "/" + voiceArray.get(idx));
                    if(similarity(scriptArray[i], voiceArray.get(idx)) > 0.6){
                        check = true;
//                        System.out.println("셋째 : " + scriptArray[i] + "/" + voiceArray.get(idx));
                        break;
                    }
                    else{
                        if(i - 1 < scriptArray.length) {
                            String temp = scriptArray[i] + scriptArray[i+1];
                            if (similarity(voiceArray.get(idx), temp) > 0.6) {
                                check = true;
//                                ++i;
                                indexTemp++;
//                                System.out.println("넷째 : " + temp + "/" + voiceArray.get(idx));
                                break;
                            }
                            else {
                                sb.append(idx+" ");
//                                sb.append(voiceArray.get(idx)+" ");
                                indexTemp++;
//                                System.out.println("마지막 실패 : " + scriptArray[idx] + "/" + voiceArray.get(idx));
                                break;
                            }
                        } else {
                            sb.append(idx+" ");
//                        	sb.append(voiceArray.get(idx)+" ");
                            indexTemp++;
//                            System.out.println("마지막 실패 : " + scriptArray[idx] + "/" + voiceArray.get(idx));
                            break;
                        }
                    }

                }
            }
        }
        String remScript = "";	// 공백,특수문자 제거한 기존 스크립트
        String remVoice = "";	// 공백 제거한 보이스 기반 스크립트

        for(String str:scriptArray) {
            remScript += str;
        }
        for(String str:voiceArray) {
            remVoice += str;
        }
        // remScript, remVoice 사이 유사도 확인
        double score = similarity(remScript,remVoice);
        StringBuilder voiceBuilder = new StringBuilder();
        for(int i = 0; i < voiceArray.size(); i++){
            voiceBuilder.append(voiceArray.get(i) + " ");
        }
        // voiceArray에 비교되지 못한 인덱스 추가하기
        if (indexTemp < voiceArray.size()) {
            for(int i = indexTemp; i < voiceArray.size(); i++){
                sb.append(i + " ");
            }
        }
        //StringBuilder를 활용하여 수정된 스크립트와 ex) 아... 음... 이런 단어는 뺀 스크립트
        //에러난 단어들을 모아둔 Stringbuilder
        Map<String, String> result = new HashMap<>();
        result.put("script", voiceBuilder.toString());
        result.put("score", String.valueOf(score));
        result.put("error", sb.toString());
        return result;
    }

    public Map analyzeVoiceEn(String script, List voice){
        script = script.toLowerCase();
        StringBuilder sb = new StringBuilder();

        String[] scriptArray = script.split(" ");

        for(int i = 0; i < scriptArray.length; i++){
            scriptArray[i] = scriptArray[i].replace(".", "");
        }
        List<String> voiceArray = new ArrayList<>();
        for(int i = 0; i < voice.size(); i++){
            String[] temp = voice.get(i).toString().split(" ");
            for(String t : temp){
                voiceArray.add(t);
            }
        }

        boolean check = false;
        int indexTemp = 0;

        for(int i = 0; i < scriptArray.length; i++){
            int idx = indexTemp;
            while(idx < voiceArray.size() && idx < scriptArray.length && idx < i+3){
                if(scriptArray[i].length() >= voiceArray.get(idx).length()){
//                    System.out.println("if 들어오는 것 : " + scriptArray[i] + "/" + voiceArray.get(idx));
                    // 첫번째 유사도 확인
                    if(similarity(scriptArray[i], voiceArray.get(idx)) > 0.6){
                        //유사도를 판단해서 비슷한지 아닌지 판단, 어느정도 유사하면 틀리다고 처리안하고 넘어감.
//                        System.out.println("첫째 "+ scriptArray[i] + "/" + voiceArray.get(idx));
                        indexTemp++;
                        break;
                    }
                    else{
                        //유사도가 낮으면 , 원본스크립트는 ex)뽑아 주신다면  변환 스크립트는 ex)뽑아주신다면 처럼
                        //" " 공백차이때문일수도 있기때문에 이러한 상황을 판단해봄.
                        if(idx + 1 < voiceArray.size()) {
                            String temp = voiceArray.get(idx) + voiceArray.get(idx + 1);
                            // 두번째 유사도 확인 - 공백으로 인한 문제일 수 있으니 다음 문자열과 합한 뒤 테스트하는 형식
                            if (similarity(scriptArray[i], temp) > 0.6) {
                                check = true;
                                voiceArray.set(idx , voiceArray.get(idx) + voiceArray.get(idx+1));
                                voiceArray.remove(idx + 1);
//                                System.out.println("둘째 : " + scriptArray[i] + "/" + temp);
                                indexTemp++;
                                break;
                            }
                            else {
                                sb.append(idx+" ");
//                            	sb.append(voiceArray.get(idx)+" ");
                                indexTemp++;
//                                System.out.println("마지막 실패 : " + scriptArray[idx] + "/" + voiceArray.get(idx));
                                break;
                            }
                        }else {	// 인덱스 개수가 같을 때 빠져나갈 방법이 없음 => 만들어 주기
                            sb.append(idx+" ");
//                        	sb.append(voiceArray.get(idx)+" ");
                            indexTemp++;
//                            System.out.println("마지막 실패 : " + scriptArray[idx] + "/" + voiceArray.get(idx));
                            break;
                        }
                    }
                }else{
//                    System.out.println("else 들어오는 것 : " + scriptArray[i] + "/" + voiceArray.get(idx));
                    if(similarity(scriptArray[i], voiceArray.get(idx)) > 0.6){
                        check = true;
//                        System.out.println("셋째 : " + scriptArray[i] + "/" + voiceArray.get(idx));
                        break;
                    }
                    else{
                        if(i - 1 < scriptArray.length) {
                            String temp = scriptArray[i] + scriptArray[i+1];
                            if (similarity(voiceArray.get(idx), temp) > 0.6) {
                                check = true;
//                                ++i;
                                indexTemp++;
//                                System.out.println("넷째 : " + temp + "/" + voiceArray.get(idx));
                                break;
                            }
                            else {
                                sb.append(idx+" ");
//                                sb.append(voiceArray.get(idx)+" ");
                                indexTemp++;
//                                System.out.println("마지막 실패 : " + scriptArray[idx] + "/" + voiceArray.get(idx));
                                break;
                            }
                        } else {
                            sb.append(idx+" ");
//                        	sb.append(voiceArray.get(idx)+" ");
                            indexTemp++;
//                            System.out.println("마지막 실패 : " + scriptArray[idx] + "/" + voiceArray.get(idx));
                            break;
                        }
                    }

                }
            }
        }
        String remScript = "";	// 공백,특수문자 제거한 기존 스크립트
        String remVoice = "";	// 공백 제거한 보이스 기반 스크립트

        for(String str:scriptArray) {
            remScript += str;
        }
        for(String str:voiceArray) {
            remVoice += str;
        }
        // remScript, remVoice 사이 유사도 확인
        double score = similarity(remScript,remVoice);
        StringBuilder voiceBuilder = new StringBuilder();
        for(int i = 0; i < voiceArray.size(); i++){
            voiceBuilder.append(voiceArray.get(i) + " ");
        }
        // voiceArray에 비교되지 못한 인덱스 추가하기
        if (indexTemp < voiceArray.size()) {
            for(int i = indexTemp; i < voiceArray.size(); i++){
                sb.append(i + " ");
            }
        }
        //StringBuilder를 활용하여 수정된 스크립트와 ex) 아... 음... 이런 단어는 뺀 스크립트
        //에러난 단어들을 모아둔 Stringbuilder
        Map<String, String> result = new HashMap<>();
        result.put("script", voiceBuilder.toString());
        result.put("score", String.valueOf(score));
        result.put("error", sb.toString());
        return result;
    }

}
