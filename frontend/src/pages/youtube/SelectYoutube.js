import React, { useEffect, useState } from "react";
import "./SelectYoutube.css"
import VideoList from './VideoList'
import axios from 'axios'
import Layout from '../../Layout';


function SelectYoutube(){
  // q는 검색어 , videos는 응답받은 영상 정보 저장 배열
    const [q, setQ] = useState('');
    const [videos, setVideos] = useState([]);
    const videoIds = ['1aA1WGON49E', 'b2f2Kqt_KcE', 'uKQknI9EdrM']
    // infinite 스크롤 작동했는지 여부 판단
    // => 요청 파라미터바꿔야함 nextPageToken 
    const [reload, setReload] = useState(false);
    const [nextPage, setNextPage] = useState('')

    const URL = 'https://www.googleapis.com/youtube/v3/videos'
    // const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY
    const params = {
        key: 'AIzaSyB0qgqnmP7rbdIR03ce_YaaSz0pa7TyY6Q',
        part: 'snippet',
        id: ''
    }

    useEffect(() => {
      videoIds.map((id) => {
        params['id'] = id
        axios.get(URL, {params})
          .then((res) => {

            setVideos(videos => [
              ...videos, 
              res.data.items[0]
            ])

          })
          .catch((err) => {
            console.log(err)
          })
      })
    }, [])
    // useEffect(() => {
    //   console.log(videos)
    // }, [videos])


    // const URL = 'https://www.googleapis.com/youtube/v3/search'
    // 검색창에서 엔터가 일어날 때 마다 요청
    // function requestData () {
    //   setReload(true)
    //   axios.get(URL, {params})
    //   .then((res) => {
    //     setNextPage(res.data.nextPageToken)
    //     console.log('요청받은 데이터: ', res.data.items)
    //     setVideos(res.data.items)

    //   })
    //   .catch((err) => {
    //     console.log('요청 에러:',err)
    //   })
    //   setReload(false)
    // }

    // 기존에 아무 영상도 없었을 때 체크 
    // 마지막 영상이라면? 
    // useEffect(() => {
    //   window.addEventListener("scroll", handleScroll)
    //   return () => {
    //     window.removeEventListener("scroll", handleScroll)
    //   }
    // })
    // 스크롤 이벤트 핸들러
    // const handleScroll = () => {
    //   const scrollHeight = document.documentElement.scrollHeight;
    //   const scrollTop = document.documentElement.scrollTop;
    //   const clientHeight = document.documentElement.clientHeight;

    //   if (scrollTop + clientHeight >= scrollHeight) {
    //     // 페이지 끝에 도달하면 추가 데이터를 받아온다
    //     requestData();
    //   }
    // };
    // Infinite Scroll 
    // useEffect(() => {
    //   window.addEventListener("scroll", handleScroll)
    //   return () => {
    //     window.removeEventListener("scroll", handleScroll)
    //   }
    // }, [reload])

    // 다음 페이지도 불러오기 
    const getQuery = (query) => {
      setQ(query)
    }
    
    return(
      <>
      <Layout></Layout>
      <div className="SelectYoutube_page">
        {/* <SearchBar getQuery={getQuery}/> */}
        {/* <img className="interview-img" src={interview} alt="" /> */}
        {/* videos에 있는 데이터를 화면에 뿌린다. => 문제점 */}
        {
          <VideoList 
            videoList={videos}
          />
        }
      </div>
      </>
    );
}

export default SelectYoutube

