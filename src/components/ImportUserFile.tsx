import {useRef,useState,useEffect} from "react"
import {readString,readRemoteFile} from "react-papaparse"

/*Compont Info:
 *A input component that gets the user csv the data is converted
 *to a array of objects and stored to the pareent useState.
 */


function ImportUserFile({setFileData,setMessage}){
	const inputFileRef = useRef<HTMLInputElement|null>(null);
	
	//convert a csv 2d array to json object
	function twoDArrayToJson(twoDArray:Array<Array<any>>): Array<object>{
		
		//initize the return array
		let jsonArray: Array<object> = [];

		//the first element will contain a list of the csv columns
		let jsonProps: Array<string> = twoDArray[0];
		
		for(let x: number = 1; twoDArray.length > x; x++){
			let json:object = {};
			for(let y: number = 0; jsonProps.length > y; y++){
				//used to select the prop in json object
				let property: string = jsonProps[y]
				json[property] = twoDArray[x][y];
			}
			jsonArray.push(json);
		}
		/*	
		jsonArray = jsonArray.map(
			function(ja){
				Moment.locale('en')
				return {
					time:Moment(ja[jsonProps[0]]).unix(),
					value:+ja["Close"]
				}});
		*/
		console.log(jsonArray);
		return jsonArray.slice(0,100);	
	};

	function getCsv(fileDir:File){
			readRemoteFile(fileDir, {
      			complete: (results) => {
				try{
        	 			setFileData(twoDArrayToJson(results.data));
					setMessage("Set the columns for the graph.")
				}catch(err){
					console.log(err)
					setMessage("The file has invalied foramt.")
				}
      			},
    		})		
	};

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
					setMessage("The file has to less the 300MB.")
				}
			}
			}} 
			ref={inputFileRef} type="file" id="dataset_file" accept=".csv"/>
		
			</div>)
}

export default ImportUserFile;
