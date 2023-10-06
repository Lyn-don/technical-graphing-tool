import { useState,useRef,useEffect } from "react";
//import as papa * from "papaparse"
//import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import ImportUserFile from "./components/ImportUserFile";
import CandleStickGraph from "./components/CandleStickGraph";
function App() {  
	const [fileData,setFileData] = useState("")
	
	
  return (
    <div className="container">
    	<ImportUserFile setFileData={setFileData}/>
	<CandleStickGraph data={fileData}/>
   </div>
  );
}

export default App;
