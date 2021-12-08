import React, { useEffect, useState } from "react";
import library from '../../image/library.png';
import youtube from '../../image/youtube.png';
import webcam from '../../image/webcam.png';
import running from '../../image/running.png';
import result from '../../image/result.png';
import ssafy from '../../image/ssafy.png';
import Page2_1 from '../../image/Page2_1.png';
import Page2_2 from '../../image/Page2_2.png';
import Page2_3 from '../../image/Page2_3.png';
import Page2_4 from '../../image/Page2_4.png';
import Page3_1 from '../../image/Page3_1.png';
import Page3_2 from '../../image/Page3_2.png';
import Page3_3 from '../../image/Page3_3.png';
import team0 from '../../image/Mr_baek.png';
import team1 from '../../image/Mr_chen.png';
import team2 from '../../image/Mr_yang.png';
import team3 from '../../image/Mr_shin.png';
import team4 from '../../image/Mr_jung.png';
import Layout from '../../Layout';
import './main.css';
import {
  Grid,
} from '@material-ui/core';
import { height } from "@mui/system";
function Main({history} ){

    return(
      <div className="main">
        <Layout></Layout>
        <Grid className="Page1" container spacing={2}>
          <Grid item xs={2}>
          </Grid>
          <Grid className="image" item xs={3}>
              <img style={{width:"100%", height:"calc(70vh + 32px)"}} className="library" src={library}></img>
              <div>
                <p> 저희 쓰앵뷰는</p>
                <p> 스크립트 입력을 통해 AI 면접 과정을 진행합니다. </p>
                <p></p>
                <p> 표정분석, 음성발음을 분석하여 면접 결과를 평가해 드립니다.</p>
                <p> 면접에는 두가지 종류가 있습니다.</p>
                <p> AI interview</p>
                <p> 표정분석, 음성발음을 분석하여 면접 결과를 평가해 드립니다.</p>
                <p> Practice English interview</p>
                <p> 표정분석, 음성발음을 분석하여 면접 결과를 평가해 드립니다.</p>
              </div>
          </Grid>
          <Grid item xs={5}>
            <Grid container spacing={2}>
              <Grid className="image" item xs={7} >
                <img style={{width:"100%", height:"30vh"}} className="youtube" src={youtube}></img>
                <div>
                  <p>저희 "쓰앵뷰"는 영어 면접 지원자를 위해서</p>
                  <p>유튜브 영상을 통해서</p>
                  <p>영어발음 및 표정관리를 연습할 수 있도록 지원합니다.</p>
                </div>
              </Grid>
              <Grid className="image" item xs={5}>
                <img style={{width:"100%", height:"30vh"}} className="running" src={running}></img>
                <div>
                  <p>지원자의 면접을 표정을 통해</p>
                  <p>호감도를 분석하며</p>
                  <p>Netural, Fear, Sad, Angry, Suprise, Happy</p>
                  <p>총 6가지의 표정을 나누어서 평가를 내립니다.</p>
                </div>
              </Grid>
              <Grid item xs={2}>
                <div className="image">
                  <img style={{width:"100%", height:"20vh"}} className="webcam" src={webcam}></img>
                  <div>
                    <p>서비스 사용시</p>
                    <p>웹캠, 마이크가</p>
                    <p>요구됩니다.</p>
                  </div>
                </div>
                <div className="image">
                  <img style={{width:"100%", height:"20vh"}} className="ssafy" src={ssafy}></img>
                  <div>
                    <p>"쓰앵뷰"는 </p>
                    <p>SSAFY에서</p>
                    <p>진행한</p>
                    <p>오픈소스 프로젝트입니다.</p>
                  </div>
                </div>
              </Grid>
              <Grid className="image" item xs={10}>
                <img style={{width:"100%", height:"40vh"}} className="result" src={result}></img>
                <div>
                <p>지원자가 면접을 마치고 나오게 된다면</p>
                <p>표정분석, 발음분석을 통해서 결과페이지를 나타냅니다.</p>
                <p>자신의 표정의 분포와 발음 스크립트를 확인하면서</p>
                <p>자신의 부족함을 채워가며 면접 역량을 키울 수 있습니다.</p>
              </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
          </Grid>
          <Grid item xs={12}>
            <h1>여러분, 쓰앵뷰를 전적으로 믿으셔야 합니다.</h1>
          </Grid>
        </Grid>
  
        <Grid className="Page2" container>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={3}>
            <div className="left" >
              <h2 style={{margin:"0"}}>
                Test
              </h2>
              <h2 style={{marginTop:"0"}}>
                your 
                interview
              </h2>
              <br/>
              <button onClick={() => {history.push("/interview/language")}} >AI interview</button>
              <br/>
              <br/>
              <br/>
              <p style={{color:"white"}}>AI면접, 어려우시죠? 걱정마세요.</p>
              <p> AI에서 사용자의 발음, 표정 </p>
              <p> 체계적인 분석을 통해 점수를 매겨드립니다.</p>
            </div>
          </Grid>
          <Grid item xs={1}>
          </Grid>
          <Grid className="right" item xs={6}>
            <Grid container spacing={2}>
              {/* 첫번째 사진들 라인 */}
              <Grid item xs={2}>
              </Grid>
              <Grid item xs={4}>
                <img className="image" src={Page2_1}></img>
              </Grid>
              <Grid item xs={4}>
                <img className="image" src={Page2_2}></img>
              </Grid>
              <Grid item xs={2}>
              </Grid>
              {/* 두번째 사진들 라인 */}
              <Grid item xs={2}>
              </Grid>
              <Grid item xs={4}>
                <img className="image" src={Page2_3}></img>
              </Grid>
              <Grid item xs={4}>
                <img className="image" src={Page2_4}></img>
              </Grid>
              <Grid item xs={2}>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1}>
          </Grid>
        </Grid>
        
        <Grid className="Page3" container>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={3}>
            <div className="left"> 
              <h2>
                Practice
                English
                interview
              </h2>
              <br/>
              <button onClick={() => {history.push("/youtube/list")}} >English interview</button>
              <br/>
              <br/>
              <br/>
              <div className="tmp_className">
                <p>
                  영어면접, 내가 어느정도의 속도로 읽는지,
                </p>
                <p>
                  발음이 부정확하지 않는지 걱정되신적 있나요?
                </p>
                <p>
                  유튜브를 기반으로 
                </p>
                <p> 
                  사용자에게 영어 면접을 
                  준비할 수 있도록 도와드립니다.
                </p>
              </div>
            </div>
          </Grid>
          <Grid item xs={1}>
          </Grid>
          <Grid className="right" item xs={6}>
            <Grid container spacing={2}>
              {/* 첫번째 사진 라인 */}
              <Grid item xs={2}>
              </Grid>
              <Grid item xs={4}>
                <img style={{width:"100%", height:"30vh"}} src={Page3_1}></img>
              </Grid>
              <Grid item xs={4}>
                <img style={{width:"100%", height:"30vh"}} src={Page3_2}></img>
              </Grid>
              <Grid item xs={2}>
              </Grid>
              {/* 두번째 사진 라인 */}
              <Grid item xs={2}>
              </Grid>
              <Grid item xs={8}>
                <img style={{width:"100%", height:"50vh"}} src={Page3_3}></img>
              </Grid>
              <Grid item xs={2}>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1}>
          </Grid>
        </Grid>
        <Grid className="Page4" container>
          <Grid style={{height:"20vh"}} item xs={12}>
            <h2>HOW IT WORKS?</h2>
          </Grid>
          <Grid item xs={1}>
          </Grid>
          <Grid className="left" item xs={5}>
            <div style={{height:"60vh"}}>
              <h3>Speech to Text</h3>
              <p>저희 STT 기술로서 ‘annyang’ 이라는</p>
              <p>사용자가 음성 명령으로 사이트를 제어할 수 있는</p>
              <p>JavaScript 음성 인식 라이브러리를 이용합니다.</p>
            </div>
          </Grid>
          <Grid className="right" item xs={5}>
            <div style={{height:"60vh"}}>
              <h3>Emotion check</h3>
              <p>한국인의 얼굴 표정과 장소 맥락을 고려하여</p>
              <p>인공지능이 사람의 감정을 이해할 수 있는</p>
              <p>학습 모델 개발을 거친 한국인 감정인식을 위한</p>
              <p>복합 영상을 분석합니다.</p>
            </div>
          </Grid>
          <Grid item xs={1}>
          </Grid>
          {/* <Grid item xs={1}>
          </Grid> */}
          <Grid style={{height:"20vh"}} className="footer"  item xs={12}>
            <p>team. we all right</p>
            <div>
              <img src={team0}></img>
              <img src={team1}></img>
              <img src={team2}></img>
              <img src={team3}></img>
              <img src={team4}></img>
            </div>
          </Grid>
        </Grid>
      </div>
    );
}

export default Main;