import {useState} from "react";
import UploadBox from "./components/uploadComponent";
import FilesShower from "./components/displayComponent";

function App() {
  const [update, setUpdate] = useState(0);

  const text = {
    color: "black",
    textAlign: "center",
  };

  const headerHighligt = {
    background: "-webkit-linear-gradient(rgb(64, 86, 161), rgb(241, 60, 32))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "40px",
  };

  const divider = {
    margin: "50px",
  };

  function updateAll() {
    setUpdate(update + 1);
  }

  return (
    <div className="App">
      <div style={divider}></div>
      <h1 style={text}>
        File <span style={headerHighligt}>Uploader</span>{" "}
      </h1>
      <FilesShower didUpdate={update} />
      <UploadBox update={updateAll} />
    </div>
  );
}

export default App;
