import { useState,useRef,useEffect } from "react";
//import as papa * from "papaparse"
//import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import ImportUserFile from "./components/ImportUserFile";
import CandleStickGraph from "./components/CandleStickGraph";
import SelectColumns from "./components/SelectColumns"

function App() {  
	const [fileData,setFileData] = useState<object>([])
	const [selectedData,setSelectedData] = useState([])
	const [message,setMessage] = useState<string>("")
	console.log(fileData);
  return (
    <div className="container">
    	<h2>{message}</h2>
    	<ImportUserFile setFileData={setFileData} setMessage={setMessage}/>
	<SelectColumns data={fileData} setData={setSelectedData}/>
	{/*(selectedData.length > 1) ? <CandleStickGraph data={selectedData}/> : null*/}
	<CandleStickGraph data={setSelectedData}/>
	
   </div>
  );
}

export default App;
