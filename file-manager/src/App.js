
import './App.css';
import UploadBox from "./components/dropcomponent.js";
import React from "react";
import FilesShower from './components/fileShower';

function App() {
  const text = {
    "color": "Black",
};

const headerHighligt = {
  "background": "-webkit-linear-gradient(rgb(64, 86, 161), rgb(241, 60, 32))",
  "WebkitBackgroundClip": "text",
  "WebkitTextFillColor": "transparent",
  "fontSize": "40px"
};

const divider = {
  "margin": "50px"
}

  return (
    <div className="App">
      <div style = {divider}></div>
      <h1 style={text}>File  <span style={headerHighligt}>Uploader</span> </h1>
      <FilesShower/>
      <UploadBox/>
    </div>
  );
}

export default App;
