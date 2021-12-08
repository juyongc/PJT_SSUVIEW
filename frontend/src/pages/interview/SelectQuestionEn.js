import React from "react";
import './SelectQuestion.css'
import Layout from '../../Layout';

function SelectQuestion({history} ){
  const questions = [
    {
      title: "Introduce Yourself",
      answer: "Hello, I'am honored to be here. First of all, thank you for inviting me for an interview. I'm excellent at adjusting to a new work environment. I like to learn new things every day. For the reason that I could tell like this, I had done AI, BigData, IoT projects. In my opinion,  Software engineer need to interested in new technologies because this attitude will make our life more better and could get competitiveness. Well, I hope I could contribute with my values to your company. Thank you"
    },
    {
      title: "Why did you apply to our company?",
      answer: "Well, I know that your company has a competitiveness on AI Software than the other companies. You know, I studied 1 year with my professor. I published two research papers and got prize on the three contest. So I could say I had a strength on AI Software. With my strength, I would like to work on your company and I would like to learn your AI technologies and develop your more efficient. I'm confident to grow me and your company on AI ability. In five years, I would like to be an expert on AI leader and will make people with comfortable life with AI technology. Thank you"
    },
    {
      title: "Tell us your pros and cons",
      answer:"I had published two research papers and got a prize on three contests on AI Software engineering. The foundation of this result was my mind. I always work hard make positive work environment and like to take a role that is hard thing. For the work environment, It is no use to be angry on working. It makes our work efficient more worse. Taking a hard role makes me study more and grow my knowledges. Of course I have a weakness. It's for the greedy on getting knowledge. You know, if I have the ability grade 100, I would like to get 120. Sometimes this makes 80 on working. So, I always check the project that I could perfectly done it. This makes up for my weakness."
    },
    {
      title: "Could you tell us your hobby?",
      answer: "I usually go to gym and exercise. I think Software engineers need to have better physical strenght because developers always sit on the chair and looks on the computers with using brain things. So exercising on gym makes me grow physical strength and helps me relieve stress. Also I always watch movies using Netflix on my bed. Last week I saw Venom2 but disappointed. I think Venom1 was more interested."
    },
  ]

  const Select = ((question)=>{
    localStorage.setItem("question",question.title)
    localStorage.setItem("answer",question.answer)
    history.push('/interview/script/en')
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