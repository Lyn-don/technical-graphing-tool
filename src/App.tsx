import { useState,useRef,useEffect } from "react";

//import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  //const [greetMsg, setGreetMsg] = useState("");
  //const [name, setName] = useState("");
  const [fileData,setFileData] = useState([])
/*
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }
let fileReader;

 const handelFileRead = (e) =>{
	const content = fileReader.result;
	console.log(content)
 }


 const handleFileChosen = (file) => {
	fileReader = new FileReader()
	fileReader.onloadend = handelFileRead();
	fileReader.readAsText(file)
 }
*/


function textToJson(text: string,delimiter: string =","){
	let csv: Array<Array<string>> = []
	let arr: Array<string> = text.split('\r')
	let jsonArray: Array<object>= []

	console.log(arr[1].replace('\n',''))
	for (let i: number= 0; arr.length > i; i++){
		csv.push(arr[i].split(delimiter))
		csv[i][0] = csv[i][0].replace('\n','')
	}
	console.log(csv)	
	csv.map((aa)=> {
		aa.map((a)=>{
			
		})
	})
	
	for(let i: number = 1; csv.length > i; i++){
		let json : object= {};
		
		for(let j: number = 0; csv[0].length > j; j++){
			json[`${csv[0][j]}`] = csv[i][j] 
	
		}
		jsonArray.push(json)
	} 

	setFileData(jsonArray)

}

  return (
    <div className="container">
	<input onChange={(e)=>{
		e.preventDefault()
   	 	const reader = new FileReader()
    			reader.onload = async (e) => {
				if(e.target?.result){
      					let text: string = e.target.result
      					textToJson(text)
      					alert(text)
				}
			};

			if(e.target.files){
    				reader.readAsText(e.target.files[0])
			}
		}} 
	value={fileData} type="file" id="dataset_file" accept=".csv"/>
	<p>{(fileData.length)? "fart":"mart"}</p>
	{/*<table>
		<thead>
			<tr>
				{Object.keys(fileData) ? Object.keys(fileData).map((e,i)=>{<th key={i}>{e}</th>}): null}

			</tr>
		</thead>
		<tbody>
			

		</tbody>
	</table>*/}	      	
	{/*
      <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      
      <p>{greetMsg}</p>*/}
    </div>
  );
}

export default App;
