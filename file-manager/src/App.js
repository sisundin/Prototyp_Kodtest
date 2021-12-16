
import './App.css';
import UploadBox from "./components/dropcomponent.js";
import React from "react";
import FilesShower from './components/fileShower';

function App() {
  const text = {
    "color": "Black",
};

const headerHighligt = {
    "color": "rgb(89, 48, 229)"
};

  return (
    <div className="App">
      <h1 style={text}>File  <span style={headerHighligt}>Uploader</span> </h1>
      <FilesShower/>
      <UploadBox/>
    </div>
  );
}

export default App;
