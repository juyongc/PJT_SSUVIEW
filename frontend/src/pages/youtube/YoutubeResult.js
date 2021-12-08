import React, { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SvgIcon from '@mui/material/SvgIcon';
import './YoutubeResult.css';
import {useLocation} from "react-router";
import Layout from '../../Layout';
import gradeA from '../../image/grade_A-removebg-preview.png'
import gradeB from '../../image/grade_B-removebg-preview.png'
import gradeC from '../../image/grade_C-removebg-preview.png'
import gradeD from '../../image/grade_D-removebg-preview.png'
import gradeF from '../../image/grade_F-removebg-preview.png'
import {
  Grid,
} from '@material-ui/core';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';
function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

function YoutubeResult({history} ){
  const tmp_data01 = [
    { name: '분노', value: 150 },
    { name: '기쁨', value: 300 },
    { name: '당황', value: 250 },
    { name: '불안', value: 200 },
    { name: '상처', value: 200 },
    { name: '슬픔', value: 200 },
    { name: '중립', value: 200 },
  ];

  // 비디오
  const recordedVideo = localStorage.getItem("videoURL")
  
  // 감정분석 결과, 비율 산출
  const emotionResult = JSON.parse(localStorage.getItem("emotionScores"));
  let emotionRatio = [0,0,0,0,0,0,0];
  // console.log("emotionResult는?",emotionResult)
  for (let i = 0; i < emotionResult.length; i++) {
    for (let j = 0; j < 7; j++) {
      emotionRatio[j] = emotionRatio[j] - emotionResult[i][j];
      // console.log(emotionResult[i][j])
    }
    emotionRatio[0] /= 1.5
  }
  // console.log("emotionRatio는?", emotionRatio)
  const sumOfEmotionScore = emotionRatio.reduce(function add(sum, currValue) {
    return sum + currValue;
  }, 0);
  // console.log("합계는?", sumOfEmotionScore)
  if (sumOfEmotionScore===0) {
    for (let j = 0; j < 7; j++){
      tmp_data01[j].value=0
    }
  }
  else{
    for (let j = 0; j < 7; j++) {
      let ratio = Math.round(emotionRatio[j] / sumOfEmotionScore * 100);
      tmp_data01[j].value = ratio;
    }
  }
  

  // 정렬
  tmp_data01.sort((a, b) => (a.value < b.value) ? 1 : -1);
  // console.log(tmp_data01);

  // STT 결과
  const sttScore = Math.round(localStorage.getItem("sttScores") * 100);
  const myScript = localStorage.getItem("sttScripts")
  const originScript = localStorage.getItem("answer")

  // 감정분석 점수 산출 (기쁨, 당황, 분노, 불안, 상처, 슬픔, 중립)
  
  let emotionScore = 0
  if(sumOfEmotionScore){
    emotionScore = parseInt( 100 - (tmp_data01[1].value + tmp_data01[3].value +tmp_data01[5].value) / 3 - (tmp_data01[2].value + tmp_data01[4].value) / 2);
  }


  const totalScore = Math.round((emotionScore + sttScore) / 2)
  let myGrade = ''
  if (totalScore > 90) {
    myGrade = gradeA
  }
  else if (totalScore > 80) {
    myGrade = gradeB
  }
  else if (totalScore > 70) {
    myGrade = gradeC
  }
  else if (totalScore > 60) {
    myGrade = gradeD
  }
  else {
    myGrade = gradeF
  }

  // 차트 라벨링
  const renderCustomizedLabel = ({
    x, y, name
  }) => {
    return (
      <text x={x} y={y} fill="#82ca9d" textAnchor="middle" dominantBaseline="middle">
        {name}
      </text>
    );
  };
  

  return (
    <>
    <div className="YoutubeResult_page">
      <Layout></Layout>
      <Grid container>
        {/* 왼쪽 2칸 */}
        <Grid item xs={2}>
        </Grid>
        <Grid item xs={4} className="firstGrid">
          <div className="myVideo">
            <video 
              controls
              style={{
                width:'80%',
                height:'80%',
              }} 
            >
              <source src={recordedVideo}></source>
            </video>
          </div>
          {/* <hr className="rowLine"/> */}
          <div className="emotion">
            <div className="emotion-chart-title">
              <span>감정 분석 결과 차트</span>
              {/* <p>감정 분석 결과 차트</p> */}
            </div>
            <div className="chartBlock">
              <div className="emotion-chart">
              <ResponsiveContainer height={"120%"} width={"110%"}>
                  <PieChart>
                  {/* <PieChart> */}
                  {/* <PieChart width='30vh' height='30vh'> */}
                    <Pie data={tmp_data01} dataKey="value" nameKey="name" cx="50%" cy="50%"  outerRadius={50} fill="#8884d8" />
                    <Pie data={tmp_data01} dataKey="value" nameKey="name" cx="50%" cy="50%"  innerRadius={60} outerRadius={80} fill="#82ca9d" paddingAngle={2} label={renderCustomizedLabel} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chartBlockEmotionLabel">
                {tmp_data01.map(emotion => {
                  return (
                    <div style={{marginTop: '0.5vh'}}>
                      <span style={{color:'goldenrod'}}>{emotion.name} &nbsp;</span>
                      <span>{emotion.value}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Grid>
        {/* <Grid item xs={1}>
        </Grid> */}
        <img src={myGrade} alt="grade" className="gradeImg"/>
        <Grid item className="part2" xs={4}>
          {/* <hr className="rowLine"/> */}
          <div className="grade">
            <Grid item xs={4} sm={4} md={4} className="myScore">
              <span style={{display:'block'}}>총점</span>
              <span className="scoreTextStyle">{totalScore}</span>
              <span style={{display:'block'}}>(표정 + 스피치)</span>
            </Grid>
            {/* <Grid className="colLine"></Grid> */}
            <Grid item xs={4} sm={4} md={4} className="myEmotion">
              <span style={{display:'block'}}>표정 점수</span>
              <span className="scoreTextStyle">{emotionScore}</span>
              <span style={{display:'block'}}>(호감도)</span>
            </Grid>
            {/* <Grid className="colLine"></Grid> */}
            <Grid item xs={4} sm={4} md={4} className="mySpeech">
              <span style={{display:'block'}}>스피치 점수</span>
              <span className="scoreTextStyle">{sttScore}</span>
              <span style={{display:'block'}}>(발음 정확도)</span>
            </Grid>

          </div>
          {/* <hr className="rowLine"/> */}
          <div className="scriptType">
            <Grid item xs={1} sm={1} md={1}></Grid>
            <Grid item xs={4} sm={4} md={4} className="scriptResultTop">
              <span>
                STT 결과
              </span>
            </Grid>
            <Grid item xs={2} sm={2} md={2}></Grid>
            <Grid item xs={4} sm={4} md={4} className="scriptResultTop">
              <span>
                스크립트
              </span>
            </Grid>
            <Grid item xs={1} sm={1} md={1}></Grid>
          </div>
          <div className="scripts">
            <div className="myScript">
              <div className="scriptText">
                <p id="myScriptString">{myScript}</p>
              </div>
            </div>
            <div className="originalScript">
              <div className="scriptText">
                <p>{originScript}</p>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={1}>
        </Grid>
      </Grid>
    </div>
    </>
  );
}

export default YoutubeResult;
