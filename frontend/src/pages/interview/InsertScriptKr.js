import React, { useEffect, useState } from "react";
import './InsertScript.css'
import Layout from '../../Layout';

function InsertScript({history, location} ){
    const [myScript, setMyScript] = useState('');
    const [myQuestion, setMyQuestion] = useState('');
    useEffect(() => {
      const answer = localStorage.getItem("answer")
      const question = localStorage.getItem("question")
      localStorage.setItem("language","ko");
      setMyScript(answer);
      setMyQuestion(question);
      // console.log(myScript)
    }, []);

    const Insert_Script = ((script)=>{
      localStorage.setItem("answer",script)
      history.push('/interview/run')
    })

    return(
      <>
      <Layout></Layout>
      <div className='InsertScript_page'>
        <h1>Insert Script</h1>
        <div className="title">
          <div className="time">2분</div>
          <div className="myQuestion">{myQuestion}</div>
        </div>
        <div className="content">
          <textarea defaultValue={myScript} onChange={e => setMyScript(e.target.value) }/>
        </div>
        <button className="submit" onClick={()=>{Insert_Script(myScript)}}>확인</button>
        <button className="back" onClick={()=>(history.go(-1))}>이전</button>
      </div>
      </>
    );
}

export default InsertScript