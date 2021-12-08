import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  AppBar,
} from '@material-ui/core';
import logo from '../../image/Logo.png';
import "./index.css"

function Header({history}){
  return (
    <AppBar className="navbar" position="relative">
      <Grid container className="navbar_container"
      > 
        <Grid item xs={2}>
        <Link to="/" className="link"><img style={{height:"5vh"}} src={logo}></img></Link>
        </Grid>
        <Grid item xs={2}>
        </Grid>
        <Grid item xs={2}>
          <p><Link to="/" className="link">Main</Link></p>
        </Grid>
        <Grid item xs={2}>
          <p><Link to="/interview/language" className="link">AI Interview</Link></p>
        </Grid>
        <Grid item xs={2}>
          <p><Link to="/youtube/list" className="link">Youtube Interview</Link></p>
        </Grid>
        <Grid item xs={2}>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default Header;
