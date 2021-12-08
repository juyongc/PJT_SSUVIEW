import React from "react";
import './SelectLanguage.css'
import Layout from '../../Layout';

function SelectLanguage({history} ){
    return(
      <>
      <Layout></Layout>
      <div className='SelectLanguage_page'>
        <h1>Language</h1>
        <p>당신에게 맞는 언어를 선택해주세요.</p>
        <div>
          <button onClick={()=>{history.push('/interview/question/kr')}}>한국어</button>
          <button onClick={()=>{history.push('/interview/question/en')}}>English</button>
        </div>
        <button className="back" onClick={()=>(history.go(-1))}>이전</button>
      </div>
      </>
    );
}

export default SelectLanguage