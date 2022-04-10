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

    // 한국어 STT vs script 비교
    public Map analyzeVoiceKr(String script, List voice){

        /**
         * STT에서 스크립트와 유사도 낮은 문자열 찾기
         */

        StringBuilder sb = new StringBuilder();
        String[] scriptArray = script.split(" ");                   // 스크립트 => 단어로 자르기
        for(int i = 0; i < scriptArray.length; i++){
            scriptArray[i] = scriptArray[i].replace(".", "");       // "." 제거
        }

        List<String> voiceArray = new ArrayList<>();                // STT 결과 저장용
        for(int i = 0; i < voice.size(); i++){
            String[] temp = voice.get(i).toString().split(" ");     // 입력받은 STT 결과물을 단어로 자르기
            for(String t : temp){
                voiceArray.add(t);                                  // voiceArray에 추가
            }
        }

        boolean check = false;
        int indexTemp = 0;
        // 모든 스크립트 단어 비교
        for(int i = 0; i < scriptArray.length; i++){
            int idx = indexTemp;        // STT 단어 리스트에서의 인덱스
            // 현재 인덱스가 STT보다 작고 && 스크립트보다 작고 && 스크립트와 STT 인덱스 일정 격차(+3) 이내
            while(idx < voiceArray.size() && idx < scriptArray.length && idx < i+3){
                if(scriptArray[i].length() >= voiceArray.get(idx).length()){        // 스크립트 단어 길이가 더 길거나 같은 경우
                    // 첫번째 유사도 확인 - 유사도를 판단해서 어느정도 유사하면 틀리다고 처리안하고 넘어감(경험값 => 0.6)
                    if(similarity(scriptArray[i], voiceArray.get(idx)) > 0.6){
                        indexTemp++;
                        break;
                    }
                    else{
                        // 두번째 유사도 확인 - 띄어쓰기로 인한 문제일 수 있으니 다음 문자열과 합한 뒤 테스트
                        //ex. "뽑아 주신다면" / "뽑아주신다면" 처럼 띄어쓰기로 인한 문제 판단
                        if(idx + 1 < voiceArray.size()) {
                            String temp = voiceArray.get(idx) + voiceArray.get(idx + 1);
                            if (similarity(scriptArray[i], temp) > 0.6) {
                                check = true;
                                voiceArray.set(idx , voiceArray.get(idx) + voiceArray.get(idx+1));
                                voiceArray.remove(idx + 1);
                                indexTemp++;
                                break;
                            }
                            else {
                                sb.append(idx+" ");
                                indexTemp++;
                                break;
                            }
                        }else {	// 인덱스 개수가 같을 때 빠져나갈 방법이 없음 => 만들어 주기
                            sb.append(idx+" ");
                            indexTemp++;
                            break;
                        }
                    }
                }else{      // STT 단어 길이가 더 길 경우
                    if(similarity(scriptArray[i], voiceArray.get(idx)) > 0.6){
                        check = true;
                        break;
                    }
                    else{
                        if(i - 1 < scriptArray.length) {
                            String temp = scriptArray[i] + scriptArray[i+1];
                            if (similarity(voiceArray.get(idx), temp) > 0.6) {
                                check = true;
                                indexTemp++;
                                break;
                            }
                            else {
                                sb.append(idx+" ");
                                indexTemp++;
                                break;
                            }
                        } else {
                            sb.append(idx+" ");
                            indexTemp++;
                            break;
                        }
                    }

                }
            }
        }

        // voiceArray에 비교되지 못한 인덱스 추가하기
        if (indexTemp < voiceArray.size()) {
            for(int i = indexTemp; i < voiceArray.size(); i++){
                sb.append(i + " ");
            }
        }

        /**
         * STT vs 스크립트 유사도 점수 측정
         */

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

        /**
         * STT 결과물 문자열로 만들기
         */
        StringBuilder voiceBuilder = new StringBuilder();
        for(int i = 0; i < voiceArray.size(); i++){
            voiceBuilder.append(voiceArray.get(i) + " ");
        }

        // 딕셔너리로 전체 반환
        Map<String, String> result = new HashMap<>();
        result.put("script", voiceBuilder.toString());
        result.put("score", String.valueOf(score));
        result.put("error", sb.toString());
        return result;
    }

    // 영어 - 방법은 위와 동일
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
                    if(similarity(scriptArray[i], voiceArray.get(idx)) > 0.6){
                        indexTemp++;
                        break;
                    }
                    else{
                        if(idx + 1 < voiceArray.size()) {
                            String temp = voiceArray.get(idx) + voiceArray.get(idx + 1);
                            if (similarity(scriptArray[i], temp) > 0.6) {
                                check = true;
                                voiceArray.set(idx , voiceArray.get(idx) + voiceArray.get(idx+1));
                                voiceArray.remove(idx + 1);
                                indexTemp++;
                                break;
                            }
                            else {
                                sb.append(idx+" ");
                                indexTemp++;
                                break;
                            }
                        }else {
                            sb.append(idx+" ");
                            indexTemp++;
                            break;
                        }
                    }
                }else{
                    if(similarity(scriptArray[i], voiceArray.get(idx)) > 0.6){
                        check = true;
                        break;
                    }
                    else{
                        if(i - 1 < scriptArray.length) {
                            String temp = scriptArray[i] + scriptArray[i+1];
                            if (similarity(voiceArray.get(idx), temp) > 0.6) {
                                check = true;
                                indexTemp++;
                                break;
                            }
                            else {
                                sb.append(idx+" ");
                                indexTemp++;
                                break;
                            }
                        } else {
                            sb.append(idx+" ");
                            indexTemp++;
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

        Map<String, String> result = new HashMap<>();
        result.put("script", voiceBuilder.toString());
        result.put("score", String.valueOf(score));
        result.put("error", sb.toString());
        return result;
    }

}
