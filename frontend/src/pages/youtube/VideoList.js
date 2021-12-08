import React, { useEffect } from 'react'
import { useHistory } from 'react-router';
import './VideoList.css'
function VideoList(props) {
  let history = useHistory();
  // useEffect(() => {
  //   if (props.videoList.length === 0) {
  //     // console.log(props)
  //     return
  //   }
  //   // props로 부모로부터 받은 영상들을 videoList 에 저장한다.
  //   // console.log('props : ', props)
  //   // console.log('props : ')
  //   // props.videoList.map((item) =>
  //   // item.snippet.thumbnails.default.url)
  //   // console.log(props.videoList[0].id)
  //   // console.log(props.videoList.length)
  // }, [props])

  return (
    <>
      <header className="videoList_header">VideoList</header>
      {/* 부모로부터 전달받은 videoList를 하나하나씩 화면에 출력 */}
      <ul className="videoList">
      { props.videoList.length > 0 &&  
        props.videoList.map((item) =>
          <li onClick={() => {
            history.push({
              pathname: '/youtube/run',
              state: {
                videoId: item.id
              }
            })
          }}
            className="video-style" key={item.id}
          >
            <img className="video-thumbnail" src={item.snippet.thumbnails.high.url} alt="youtube-thumbnail-image" />
            <div className="video-title">
              <span>{item.snippet.title}</span>
            </div>
          </li>
          )
        }
      </ul>
      <button className="video-back" onClick={()=>(history.go(-1))}>이전</button>
    </>
  );

}
export default VideoList;