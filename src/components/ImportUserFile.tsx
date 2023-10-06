import {useRef,useState,useEffect} from "react"
import {readString,readRemoteFile} from "react-papaparse"

function ImportUserFile({setFileData}){
	const inputFileRef = useRef<HTMLInputElement|null>(null);

	//convert a csv 2d array to json object
	function twoDArrayToJson(twoDArray:Array<Array<any>>): Array<object>{
		let jsonArray: Array<object> = [];
		let jsonProps: Array<string> = twoDArray[0];
		for(let x: number = 1; twoDArray.length > x; x++){
			let json:object = {};
			for(let y: number = 0; jsonProps.length > y; y++){
				json[jsonProps[y]] = twoDArray[x][y];
			}
			jsonArray.push(json);
		}
		return jsonArray
	}

	function getCsv(fileDir:File){
			readRemoteFile(fileDir, {
      			complete: (results) => {
        	 		setFileData(twoDArrayToJson(results.data));
      			},
    		})		
	}

	return(<div>
		<input onChange={(e)=>{
			if(e.target.files && inputFileRef.current){
			e.preventDefault()
			let fileSize : number = +e.target.files[0].size	

			//checks if the file is not larger the 300 megabytes
			if(fileSize/1000000 < 300){
				//only run fuction if the file exist
				getCsv(e.target.files[0]);	
			}else{
				//tell the user the file is too large
			
				inputFileRef.current.value = ""
			}

			}
			}} 
			ref={inputFileRef} type="file" id="dataset_file" accept=".csv"/>
			</div>)
}

export default ImportUserFile;
