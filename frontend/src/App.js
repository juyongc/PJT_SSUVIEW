import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import main from './pages/main/main.js';
import SelectLanguage from './pages/interview/SelectLanguage.js';
import SelectQuestionKr from './pages/interview/SelectQuestionKr.js';
import SelectQuestionEn from './pages/interview/SelectQuestionEn.js';
import InsertScriptEn from './pages/interview/InsertScriptEn.js';
import InsertScriptKr from './pages/interview/InsertScriptKr.js';
import InterviewRunning from './pages/interview/InterviewRunning.js';
import InterviewResult from './pages/interview/InterviewResult.js';
import SelectYoutube from './pages/youtube/SelectYoutube.js';
import YoutubeRunning from './pages/youtube/YoutubeRunning.js';
import YoutubeResult from './pages/youtube/YoutubeResult.js';
import { Provider, useSelector, useDispatch } from 'react-redux'
import { createStore } from 'redux'

function App() {
  return (
    <BrowserRouter>
    <Switch>
      <Route exact path="/" component={main}/>
      <Route exact path="/interview/language" component={SelectLanguage} />
      <Route exact path="/interview/question/kr" component={SelectQuestionKr} />
      <Route exact path="/interview/question/en" component={SelectQuestionEn} />
      <Route exact path="/interview/script/en" component={InsertScriptEn} />
      <Route exact path="/interview/script/kr" component={InsertScriptKr} />
      <Route exact path="/interview/run" component={InterviewRunning} />
      <Route exact path="/interview/result" component={InterviewResult} />
      <Route exact path="/youtube/list" component={SelectYoutube} />
      <Route exact path="/youtube/run" component={YoutubeRunning} />
      <Route exact path="/youtube/result" component={YoutubeResult} />
    </Switch>
    </BrowserRouter>
  );
}


export default App;
