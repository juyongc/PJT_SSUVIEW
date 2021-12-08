import React from "react";
import './SelectQuestion.css'
import Layout from '../../Layout';



function SelectQuestion({history} ){
  const questions = [
    {
      title: "자기소개를 해주세요",
      answer: "안녕하십니까 제 이름은 홍길동입니다. 저는 한마디로 에너자이저로 말할 수 있겠습니다. 모든 일에 열정적입니다. 저를 뽑아주신다면 팀원의 사기를 증진시키겠습니다."
    },
    {
      title: "지원동기가 어떻게 되시나요?",
      answer: "NCN에서 디자이너로 일하시는 선배님의 열정을 느끼며, 패션 잡화 디자이너를 꿈꿨습니다. 학부 시절 NCN 디자이너로 일하시는 선배님과의 멘토 만남을 한 적이 있습니다. 어릴 때부터 패션계에서 일하는 꿈을 가지고 있던 저는 선배님과의 멘토링 만남에서 가방 디자이너라는 직무를 알게 되었으며, 잡화디자이너의 꿈을 키우게 되었습니다."
    },
    {
      title: "자신의 장점과 단점을 말해주세요",
      answer:"어떤 일을 하든지 내 이름을 걸고 한다는 생각으로 최선을 다합니다. 대학 시절, 학업 외에 다양한 아르바이트로 사회를 배워나갔습니다. 이때, 내 이름을 건 작업뿐만 아니라 사소한 아르바이트도 ‘이름을 걸고 하자! 내 이름에 먹칠하지 말자!’는 마음을 지니고 항상 최선을 다했습니다. 단점으로는 모든 일을 완벽하게 해내고자 하는 욕심이 커서 맡은 바에 대해서 지나친 정성을 쏟습니다. 그 결과 풀리지 않는 것에 지나치게 욕심을 부리거나 집착하여 시간 관리를 못해, 일을 그르친 경험을 한 적이 있습니다." 
    },
    {
      title: "취미가 있다면 말해주실수있나요?",
      answer: "가난한 아이들을 가르치며 자원봉사를 즐깁니다. 대학 시절 내내 저는 몇 개의 비영리 단체에 참여해 왔으며 가르치는 것부터 시작해 재미있는 게임을 활용해 아이들과 교류를 가졌습니다."
    },
  ]
  
  const Select = ((question)=>{
    localStorage.setItem("question",question.title)
    localStorage.setItem("answer",question.answer)
    history.push('/interview/script/kr')
  })
    return(
      <>
      <Layout></Layout>
      <div className='SelectQuestion_page'>
        <h1>Select Question</h1>
        <div className="questions_li">
          {
            questions.map((question,idx)=>(
              <button key={idx} onClick={()=>{Select(question)}}>
                  {idx+1}. {question.title}</button>
              ))
          }
        </div>
        <button className="back" onClick={()=>(history.go(-1))}>이전</button>
      </div>
      </>
    );
}

export default SelectQuestion