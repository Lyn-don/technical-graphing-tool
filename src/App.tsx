import { useState, useRef, useEffect } from "react";
//import as papa * from "papaparse"
//import { invoke } from "@tauri-apps/api/tauri";

import ImportUserFile from "./components/ImportUserFile";
import CandleStickGraph from "./components/CandleStickGraph";
import SelectColumns from "./components/SelectColumns";

import "./styles/App.css";
function App() {
  const [fileData, setFileData] = useState<object>([]);
  const [selectedData, setSelectedData] = useState([]);
  const [message, setMessage] = useState<string>("Select a csv file.");
  const appRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={appRef} className="container">
      <button className="menu-button" onClick={(e) => {}}>
      	<div className="menu-icon"></div>
	<div className="menu-icon"></div>
	<div className="menu-icon"></div>
      </button>
      <div className="menu">
        {" "}
        <h2>{message}</h2>
        <ImportUserFile setFileData={setFileData} setMessage={setMessage} />
        <SelectColumns data={fileData} setData={setSelectedData} />
      </div>
      {(selectedData.length > 1) ? <CandleStickGraph data={selectedData}/> : null}
    </div>
  );
}

export default App;
