import { useState,useRef,useEffect } from "react";
//import as papa * from "papaparse"
//import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import ImportUserFile from "./components/ImportUserFile";
function App() {  
	const [fileData,setFileData] = useState("")
	
	
  return (
    <div className="container">
    	<ImportUserFile setFileData={setFileData}/>

	{<table>
		<thead>
			<tr>
				{Object.keys(fileData) ? Object.keys(fileData).map((e,i)=>{<th key={i}>{e}</th>}): null}

			</tr>
		</thead>
		<tbody>
			

		</tbody>
		</table>}	      	
	
    </div>
  );
}

export default App;
