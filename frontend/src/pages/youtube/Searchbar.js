import { React, useState } from 'react';
import './Searchbar.css'
function SearchBar(props) {
  const sendQuery = (query) => {
    props.getQuery(query)
  }
  return (
    <div className="search">
      <i className="fas fa-search"></i>
      <input
        className="search-bar" 
        type="text"
        placeholder="Search"
        onKeyPress = { (e) => {
          if (e.key ==='Enter') { 
            sendQuery(e.target.value)
          }
        }}
      />
    </div>
  );
}

export default SearchBar;