import React,{useState, useEffect, useRef} from "react";
import { useHistory } from 'react-router';
import Webcam from "react-webcam";
import './interviewRunning.css';
import {
  Button,
  // CssBaseline,
  // TextField,
  // Link,
  // Paper,
  Grid,
  // Typography,
  // makeStyles,
} from '@material-ui/core/';
import axios from 'axios';
import annyang from "annyang";
import play from '../../image/play.svg'
import playDisbled from '../../image/playDisabled.svg'
import stop from '../../image/stop.svg'
// import interviewResult from './InterviewResult'
import Layout from '../../Layout';
import Modal from 'react-modal';
// import aiInterviewImage from '../images/AiInterview.jpg';

// const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const padNumber = (num, length) => {
  return String(num).padStart(length, '0');
};

function InterviewRunning({ location }){
  // Axios 요청 보낼 base URL
  // const baseURL = "http://localhost:8080/";
  const baseURL = "https://k5b103.p.ssafy.io/"

  const history = useHistory();
  // const classes = useStyles();
  const webcamRef = React.useRef(null);
  // 캡쳐용 useState
  const [captureStart, setCaptureStart] = useState(false)
  const [captureImg, setCaptureImg] = useState([])
  const [captureImgBlob, setCaptureImgBlob] = useState([])
  const [showScript, setShowScript] = useState(true)
  // 스크립트 저장
  const [myScript, setMyScript] = useState('')
  const [myQuestion, setMyQuestion] = useState('');
  useEffect(() => {
    const script = localStorage.getItem("answer")
    const question = localStorage.getItem("question")
    const language = localStorage.getItem("language")
    if(language==="ko"){
      annyang.setLanguage('ko')
    }else{
      annyang.setLanguage('en-US')
    }
    setMyQuestion( question)
    setMyScript(script)
    // console.log(question,myQuestion)
  }, []);
  // 녹화용 useState 
  const mediaRecorderRef = React.useRef(null);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [recordedVideo, setRecordedVideo] = React.useState('');
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  // STT
  const [STTsounds] = React.useState([]);
  // 결과 제출 버튼 활성화
  const [submitButtonActivate, setSubmitButtonActivate] = React.useState(false);
  // 스크립트 보이기/감추기 메소드
  const [cntScriptHideButton, setCntScriptHideButton] = useState(0);
  const showScriptBool = () => {
    setShowScript(!showScript);
    setCntScriptHideButton(cntScriptHideButton+1);
  }
  // annyang.setLanguage('ko');
  // 시작하기 버튼 누르면 첫번째 캡쳐를 시작으로 연속 캡쳐 시작(captureStart => true)
  // const goCaptureStart = () => {
  //   setCaptureStart(true);c
  //   handleStartCaptureClick();
  //   capture();
  // }

  // 웹캠 캡쳐 후 imageSrc에 캡쳐 이미지 할당 메소드
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      
      const blob = dataURIToBlob(imageSrc)
      // console.log('blob은? ', blob)
      setCaptureImgBlob(captureImgBlob => [...captureImgBlob, blob])
      // setCaptureImg(captureImg => [...captureImg, imageSrc])
      // console.log('캡쳐 이미지 blob 배열은? ', captureImgBlob)
    },
    [webcamRef]
  );

  const handleStartCaptureClick = React.useCallback(() => {
    setCaptureStart(true);
    capture();
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
    // STT annyang
    annyang.start({ autoRestart: false, continuous: true });
    var recognition = annyang.getSpeechRecognizer();
    var final_transcript = "";
    recognition.interimResults = true;
    recognition.onresult = function(event) {
        var interim_transcript = "";
        final_transcript = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
                // console.log("final_transcript="+final_transcript);
                
                STTsounds.push(event.results[i][0].transcript);
                //annyang.trigger(final_transcript); //If the sentence is "final" for the Web Speech API, we can try to trigger the sentence
            } else {
                interim_transcript += event.results[i][0].transcript;
                // console.log("interim_transcript="+interim_transcript);
            }
        }
        // document.getElementById('result').innerHTML =  '중간값:='+interim_transcript+'<br/>결과값='+final_transcript;
        // console.log('interim='+interim_transcript+'|final='+final_transcript);
        // console.log(STTsounds)
        // console.log(typeof STTsounds[0])
    };

  }, [webcamRef, setCaptureStart, mediaRecorderRef]);
  

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const makeRecordVideo = React.useCallback(() => {
    // console.log('chunk 있나?', recordedChunks)
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      // console.log(url)
      setRecordedVideo(url);
      localStorage.setItem("videoURL", url);
      setRecordedChunks([]);
    }
  }, [mediaRecorderRef, webcamRef, recordedChunks]);

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setTimeout(() => {
      annyang.abort();
    }, 3000);
    setCaptureStart(false);
    setSubmitButtonActivate(true);
    // console.log('멈췄을 때 캡쳐 이미지 blob 배열은? ', captureImgBlob)
  }, [mediaRecorderRef, setCaptureStart]);


  function dataURIToBlob(dataURI) {
    // console.log('dataURI : ', dataURI);
    const decodImg = atob(dataURI.split(',')[1]);
    // console.log(decodImg)
    let array = [];
    for (let i = 0; i < decodImg .length; i++) {
      array.push(decodImg .charCodeAt(i));
    }
    const file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});

    return file;
    // return new Blob([arrayBuffer], {type: 'image/jpeg'});
  }

  const interviewSubmitCheck = () => {
    makeRecordVideo();
    setModalIsOpen(true);
    // console.log('결과확인 버튼을 누를 때 캡쳐 이미지 blob 배열은? ', captureImgBlob)
  }

  const interviewSubmit = () =>{
    var formdata = new FormData();
    let idx = 1;
    for (let i = 0; i < captureImgBlob.length; i++) {
      const fileName = 'file'+ idx + '.jpg';
      formdata.append("file", captureImgBlob[i], fileName);
      idx++;
      // formdata.append('file', document.getElementById(captureImgBlob[i]));
    }

    // var formdataSTT = new FormData();
    // formdataSTT.append("script", myScript)
    // formdataSTT.append("voice", STTsounds)
    localStorage.setItem("sttScripts", STTsounds);
    // formdata.append("file", captureImgBlob)
    axios({
      url:baseURL + "api/test/interview/face",
      // url:baseURL + "test/interview/second",
      method:'post',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data:formdata,
    })
      .then((res)=>{
        // console.log(res.data.scores)
        localStorage.setItem("emotionScores", JSON.stringify(res.data.scores));
        axios.post(baseURL + "api/test/interview/voice",{
          script: myScript,
          voice:STTsounds,
        },
        )
          .then((sttresponse)=>{
            localStorage.setItem("sttScores", sttresponse.data.score);
            
            history.push(
              "/youtube/result"
              
            )
          })
          .catch((err)=>{
            // console.log(err)
          })
      })
      .catch((err)=>{
        // console.log(formdata)
      })
  }

  // 스크립트 저장
  // useEffect(() => {
  //   setMyScript(location.props.script)
  // }, [])

  // 연속 캡쳐
  useEffect(() => {
    const captureWebcam = setInterval(() => {
      if (captureStart) {
        capture();
      }
    }, 1000);
    return () => clearInterval(captureWebcam);
  }, [captureImg, capture, captureStart]);

  // 타이머
  const tempMin = 2;
  const tempSec = 0;
  // 타이머를 초단위로 변환한 initialTime과 setInterval을 저장할 interval ref
  const initialTime = useRef(tempMin * 60 + tempSec);
  const interval = useRef(null);

  const [min, setMin] = useState(padNumber(tempMin, 2));
  const [sec, setSec] = useState(padNumber(tempSec, 2));

  useEffect(() => {
    interval.current = setInterval(() => {
      if (captureStart) {
        initialTime.current -= 1;
        setSec(padNumber(initialTime.current % 60, 2));
        setMin(padNumber(parseInt(initialTime.current / 60), 2));
      }
    }, 1000);
    return () => clearInterval(interval.current);
  }, [captureStart]);

  // 초가 변할 때만 실행되는 useEffect
  // initialTime을 검사해서 0이 되면 interval을 멈춘다.
  useEffect(() => {
    if (initialTime.current <= 0 && captureStart) {
      clearInterval(interval.current);
      setCaptureStart(false);
      setSubmitButtonActivate(true);
    }
  }, [sec]);

  return(
    <>
    {/* <Layout></Layout> */}
    <div className="interviewRunning_page">
      <Layout></Layout>
      <Grid 
        container
        className="content"
        // className={(() => {
        //   if (!showScript) {
        //     return (
        //       "content contentHideAnimation"
        //     )
        //   } else if (showScript && !cntScriptHideButton) {
        //     return (
        //       "content"
        //     )
        //   } else {
        //     return (
        //       "content contentShowAnimation"
        //     )
        //   }
        // })()}
      >
        <Grid 
          item 
          xs={6} 
          sm={6} 
          md={6} 
          className={(() => {
            if (!showScript) {
              return (
                "bg1 webcamHideAnimation"
              )
            } else if (showScript && !cntScriptHideButton) {
              return (
                "bg1"
              )
            } else {
              return (
                "bg1 webcamShowAnimation"
              )
            }
          })()}
        >
          <div className="question">
            <span className="question_font">
              {myQuestion}
            </span>
          </div>
          <div className="webcam">
            <Webcam
              forceScreenshotSourceSize
              videoConstraints={{
                height: 1080,
                width: 1600
              }}
              muted={true}
              audio={true}
              height="70%"
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="80%"
              videoConstraints={videoConstraints}
            />
            <div className="timer">
              
              <span>
                {min} : {sec}
              </span>
              
            </div>
            {(() => {
              if (captureStart) {
                return (
                  <Button>
                    <img 
                      src={stop}
                      onClick={handleStopCaptureClick} 
                      alt="stop"
                    />
                    {/* 빨간 녹화중 표시 */}
                    <button className="record-button Rec" onClick={handleStopCaptureClick}></button>
                    
                  </Button>
                )
              } else if (!captureStart && submitButtonActivate) {
                return (
                  <Button
                    disabled
                  >
                    <img 
                      src={playDisbled} 
                      onClick={handleStartCaptureClick} 
                      alt="play"
                      className="playButtonStyle"
                    />
                  </Button>
                )
              } else {
                return (
                  <Button>
                    <img 
                      src={play} 
                      onClick={handleStartCaptureClick} 
                      alt="play"
                      className="playButtonStyle"
                    />
                  </Button>
                )
              }
            })()}
          </div>
        </Grid>
        <Grid 
          item 
          xs={5} 
          sm={5} 
          md={5} 
          className={(() => {
            if (!showScript) {
              return (
                "right_bg scriptHideAnimation"
              )
            } else if (showScript && !cntScriptHideButton) {
              return (
                "right_bg"
              )
            } else {
              return (
                "right_bg scriptShowAnimation"
              )
            }
          })()}
        >
          {/* { showScript && */}
            <div>
              <div className="showScriptButton">
                <Button
                  disabled
                  type="submit"
                  className="submit"
                  onClick={showScriptBool}
                >
                  <span className="submit_font">
                    스크립트
                  </span>
                </Button>
              </div>
            
              <div className="scriptBg">
                <div className="bg2" >
                  <div className="script">
                    <span>
                      {myScript}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          {/* } */}
        </Grid>
        <Grid item xs={'auto'} sm={'auto'} md={'auto'}>
          <div
            // className="scriptHideButton"
            className={(() => {
              if (!showScript) {
                return (
                  "scriptHideButton scriptHideButtonAnimation"
                )
              } else if (showScript && !cntScriptHideButton) {
                return (
                  "scriptHideButton"
                )
              } else {
                return (
                  "scriptHideButton scriptShowButtonAnimation"
                )
              }
            })()}
            onClick={showScriptBool}
          >
            {showScript ?
              <span className="scriptHideButtonText">&nbsp;&#60;</span> :
              <span className="scriptHideButtonText">&nbsp;&#62;</span>
            }
          </div>
        </Grid>
      </Grid>
      <div className="footer">
        {submitButtonActivate ? (
          <Button
            type="submit"
            className="result_check"
            onClick={interviewSubmitCheck}
          >
            <span>
              제출
            </span>
          </Button>
        ) : (
          <Button
            disabled
            type="submit"
            className="result_check"
            onClick={interviewSubmitCheck}
          >
            <span>
              제출
            </span>
          </Button>
        )}
      </div>

      {/* 모달 부분 */}
      <Modal 
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            display:'absolute',
            left: '35vw',
            top: '35vh',
            width:'30vw', 
            height:'33vh',
            background: 'rgba(0,0,0,0)',
            color: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          content: {
            background: 'rgba(50,50,50,0.7)',
            border: '3px solid white',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }
        }}
      >
        <div
          style={{
          }}
        >
          <h2>
            결과를 확인하시겠습니까?
          </h2>
          <Button
            onClick={interviewSubmit}
            style={{
              color: "white",
              width: '9vw',
              height: '4vh',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 25px 25px rgba(0,0,0,0.2)',
              borderRadius: '5px',
              borderTop: '1px solid rgba(255,255,255,0.5)',
            }}
          >
            YES
          </Button>
          <Button
            onClick={()=>setModalIsOpen(false)}
            style={{
              marginLeft: '0.5vw',
              color: "white",
              width: '9vw',
              height: '4vh',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 25px 25px rgba(0,0,0,0.2)',
              borderRadius: '5px',
              borderTop: '1px solid rgba(255,255,255,0.5)',
            }}
            
          >
            NO
          </Button>
        </div>
      </Modal>
    </div>
  </>
  );
}

export default InterviewRunning
