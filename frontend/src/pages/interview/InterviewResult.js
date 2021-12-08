import React, { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SvgIcon from '@mui/material/SvgIcon';
import './InterviewResult.css';
import {useLocation} from "react-router";
import Layout from '../../Layout';
import {
  Grid,
} from '@material-ui/core';
import { PieChart, Pie } from 'recharts';
function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

function InterviewResult({history} ){
  const location = useLocation();
  const tmp_data01 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];
  const tmp_data02 = [
    { name: 'A1', value: 100 },
    { name: 'A2', value: 300 },
    { name: 'B1', value: 100 },
    { name: 'B2', value: 80 },
    { name: 'B3', value: 40 },
    { name: 'B4', value: 30 },
    { name: 'B5', value: 50 },
    { name: 'C1', value: 100 },
    { name: 'C2', value: 200 },
    { name: 'D1', value: 150 },
    { name: 'D2', value: 50 },
  ];
  
  // const recordedVideo = location.state.recordedVideo
  const recordedVideo = localStorage.getItem("videoURL")
  return (
    <>
    <Layout></Layout>
    <div class="InterviewResult_page">
      <Grid container>
        <Grid item xs={2}>
        </Grid>
        <Grid item xs={3}>
          <video className="video" controls>
            <source src={recordedVideo}></source>
          </video>
          <div className="container">
          <div className="emotion">
            <PieChart width={730} height={250}>
              <Pie data={tmp_data01} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
              <Pie data={tmp_data02} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
            </PieChart>
          </div>
          </div>
        </Grid>
        <Grid item className="part2"  xs={5}>
          <div className="grade">
            <div>A+</div>
            <div>상태</div>
          </div>
          <div className="scripts">
            <div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure accusamus pariatur ipsam ea suscipit natus, cumque a ullam enim, eos corrupti voluptates nemo corporis fugit est eligendi neque cum molestiae.</p>
            </div>
            <div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure accusamus pariatur ipsam ea suscipit natus, cumque a ullam enim, eos corrupti voluptates nemo corporis fugit est eligendi neque cum molestiae.</p>
            </div>
          </div>
          <div className="resultState">
            <div className="sticker"></div>
            <div className="sticker"></div>
            <div className="sticker"></div>
          </div>
        </Grid>
        <Grid item xs={2}>
        </Grid>
      </Grid>
    </div>
    </>
  );
}

export default InterviewResult;