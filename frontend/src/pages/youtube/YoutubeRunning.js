import React,{useState, useEffect, useRef} from "react";
import './YoutubeRunning.css'
import Webcam from "react-webcam";
import {
  Grid,
  Button
} from '@material-ui/core';
import tmp_youtube1 from '../../image/tmp_youtube1.png'
import play from '../../image/play.svg'
import playDisbled from '../../image/playDisabled.svg'
import Modal from 'react-modal';
import stop from '../../image/stop.svg'
import download from '../../image/download.svg'
import annyang from "annyang";
import axios from 'axios';
import tedScript from '../../dummyData/transcription.json'
import Layout from '../../Layout';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const padNumber = (num, length) => {
  return String(num).padStart(length, '0');
};

function YoutubeRunning({history, location}){
  let myTempData = []
  // Axios 요청 보낼 base URL
  // const baseURL = "http://localhost:8080/";
  const baseURL = "https://k5b103.p.ssafy.io/"

  const [myScript, setMyScript] = useState([]);
  const [myQuestion, setMyQuestion] = useState('');
  useEffect(() => {
    const script = localStorage.getItem("answer")
    const question = localStorage.getItem("question")
    setMyQuestion( question)
    setMyScript(script)
    // console.log(question,myQuestion)
  }, []);
  //백 제출용 스크립트 // 시간 제외한 스크립트////////
  const [submitScript, setSubmitScript] = useState('');

  const webcamRef = React.useRef(null);
  // const mediaRecorderRef = React.useRef(null);
  const [captureStart, setCaptureStart] = React.useState(false);
  // 종우
  const [captureImg, setCaptureImg] = useState([])
  const [captureImgBlob, setCaptureImgBlob] = useState([])
  const [showScript, setShowScript] = useState(true)

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
  annyang.setLanguage('en-US')

  useEffect(() => {
    setMyScript(parseTranscription(location.state.videoId))
  }, [location])


  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );
  
  // 캡쳐
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = dataURIToBlob(imageSrc)
      setCaptureImgBlob(captureImgBlob => [...captureImgBlob, blob])
    },
    [webcamRef]
  );

  // 웹캠 
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

    annyang.start({ autoRestart: false, continuous: true });
    var recognition = annyang.getSpeechRecognizer();
    var final_transcript = '';
    recognition.interimResults = true;
    recognition.onresult = function(event) {
        var interim_transcript = '';
        final_transcript = '';
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
    };
  }, [webcamRef, setCaptureStart, mediaRecorderRef]);


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
  }, [mediaRecorderRef, setCaptureStart]);

  // base64 => blob 포맷 변환
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
    // formdata.append("file", captureImgBlob)
    localStorage.setItem("sttScripts", STTsounds);
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
        // console.log(res)
        // console.log('STT 리스트',STTsounds)
        // console.log('스크립트 string',submitScript.substring(0,10))
        localStorage.setItem("emotionScores", JSON.stringify(res.data.scores));
        axios.post(baseURL + "api/test/interview/voice",{
          script: submitScript,
          voice:STTsounds,
        },
        )
          .then((sttresponse)=>{
            // console.log('이건 STT 결과',sttresponse)
            localStorage.setItem("sttScores", sttresponse.data.score);
            history.push(
              "/youtube/result",
            )
          })
          .catch((err)=>{
            // console.log(err)
          })
      })
      .catch((err)=>{
        // console.log(err)
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
  // const tempMin = 2;
  // const tempSec = 0;
  // // 타이머를 초단위로 변환한 initialTime과 setInterval을 저장할 interval ref
  // const initialTime = useRef(tempMin * 60 + tempSec);
  // const interval = useRef(null);

  // const [min, setMin] = useState(padNumber(tempMin, 2));
  // const [sec, setSec] = useState(padNumber(tempSec, 2));

  // useEffect(() => {
  //   interval.current = setInterval(() => {
  //     if (captureStart) {
  //       initialTime.current -= 1;
  //       setSec(padNumber(initialTime.current % 60, 2));
  //       setMin(padNumber(parseInt(initialTime.current / 60), 2));
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval.current);
  // }, [captureStart]);

  // // 초가 변할 때만 실행되는 useEffect
  // // initialTime을 검사해서 0이 되면 interval을 멈춘다.
  // useEffect(() => {
  //   if (initialTime.current <= 0 || !captureStart) {
  //     clearInterval(interval.current);
  //   }
  // }, [sec]);


  // 자막 parsing
  function parseTranscription (id) {
    let tempData = []
    let time = 0
    let tmpScript =''
    tedScript[id].map((data) => {
      // 우선 1000으로 나눈다 (ms이기 때문) 정수로바꿔줌
      // 1자리 수면 00:0x
      // 2자리 수면 00:xx (60초 넘으면 3자리로 바꿈)
      // 3자리 수면 0x:xx
      // 4자리 수면 xx:xx
      time = parseInt(data.tStartMs / 1000)
      let hour = 0
      let minute = 0
      let second = 0
      if (time < 60) {
        second = time
      } else if (time >= 60 && time < 3600) {
        minute = parseInt(time / 60)
        second = time % 60
        // 10시간까지의 영상만 체크 
      } else if (time >= 3600 && time < 36000) {
        hour = parseInt(time / 3600)
        minute = parseInt(time / 60)
        second = time % 60
      }
      let strTime = ''
      if (hour > 0) {
        if (minute < 10) {
          if (second < 10) { // 01:01:01
            strTime = `0${hour}:0${minute}:0${second}`
          } else { // 01:01:11
            strTime = `0${hour}:0${minute}:${second}`
          }
        } else { // 01:11:01
          if (second < 10) {
            strTime = `0${hour}:${minute}:0${second}`
            } else { // 01:11:11
              strTime = `0${hour}:${minute}:${second}`
            }
        }
      } else {
        if (minute < 10) {  
          if (second < 10) { // 01:01
            strTime = `0${minute}:0${second}`
          } else { // 01:11
            strTime = `0${minute}:${second}`
          }
        } else { // 10:01
          if (second < 10) {
            strTime = `${minute}:0${second}`
          } else { // 10:11
            strTime = `${minute}:${second}`
          }
        }
      }
      tempData.push({
        'start': strTime,
        'content': data.segs[0].utf8 +'\n'
      })
      tmpScript += data.segs[0].utf8
    })
    // console.log(tempData)
    myTempData = tempData
    // console.log(myTempData)
    // console.log(tmpScript)
    localStorage.setItem("answer",tmpScript)
    setSubmitScript(tmpScript)
    return myTempData
  }

        
  return(
    <>
    <div className="YoutubeRunning_page">
      <Layout></Layout>
      
      {/* 컨테이너 */}
      {/* <Grid className="container" container spacing={2}> */}
      <Grid className="content" container>
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
              {/* {myQuestion} */}
              Youtube Interview Practice
            </span>
          </div>
          <div className="webcam">
            <Webcam
              forceScreenshotSourceSize
              videoConstraints={{
                height: 1080,
                width: 1600
              }}
              audio={true}
              muted={true}
              height="70%"
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="80%"
              videoConstraints={videoConstraints}
            />
            {/* <div className="timer">
              <span>
                {min} : {sec}
              </span>
            </div> */}
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
                    <img src={playDisbled} onClick={handleStartCaptureClick} alt="play"/>
                  </Button>
                )
              } else {
                return (
                  <Button>
                    <img src={play} onClick={handleStartCaptureClick} alt="play"/>
                  </Button>
                )
              }
            })()}
          </div>
        </Grid>

        {/* <Grid item className="Youtube" xs={6} md={6}>
          <iframe src={`https://www.youtube.com/embed/${location.state.videoId}`}
            id="ytplayer" 
            type="text/html" 
            frameBorder="0"
            width="350"
            height="200">
          </iframe>
          <textarea className="youtube-textarea" defaultValue={myScript.map((data) => {
            return data.start + ' : ' + data.content
          }).join('')}>
          </textarea>
        </Grid> */}
        
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
          <iframe src={`https://www.youtube-nocookie.com/embed/${location.state.videoId}`}
            id="ytplayer" 
            type="text/html" 
            frameBorder="0"
            width="350"
            height="200"
            className="youtube-video"
            controls="1"
            >
          </iframe>
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
                    <textarea className="youtube-textarea" defaultValue={myScript.map((data) => {
                      return data.start + ' : ' + data.content
                    }).join('')}>
                    </textarea>
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
            // left: '35vw',
            // top: '35vh',
            margin:'auto',
            width:'30vw', 
            height:'33vh',
            background: 'rgba(0,0,0,0)',
            color: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize:"1.5vmin"
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
        <div>
          <h2>
            결과를 확인하시겠습니까?
          </h2>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <Button
              onClick={interviewSubmit}
              style={{
                color: "white",
                width: '45%',
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
                width: '45%',
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
        </div>
      </Modal>
    </div>
    </>
  );
}

export default YoutubeRunning
