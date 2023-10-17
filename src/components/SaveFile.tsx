import {useState,useEffect} from "react";
import { useCSVDownloader,jsonToCSV } from "react-papaparse";

function SaveFile({fileData,selectedData}){
	const {CSVDownloader,Type} = useCSVDownloader();
	const [data,setData] = useState();
	
	useEffect(()=>{

		if(fileData.length>1&&selectedData.length>1){
			
			let marks = selectedData.map((el)=>{return{time:el["time"],ml_signal:el["ml_signal"]}});
			
			console.log(marks)
			
			let combined = fileData.filter((f)=>{f["time"]===marks["time"]})

			console.log(combined);

			setData(fileData)
		}
	},[fileData,selectedData,data])

	if(data){
	return (
		<div className="div--save-data">
			<CSVDownloader 
			type={Type.Button}
			filename={"test_2"}
			bom={true}
			config={{delimiter:","}}
			data={data}>
				Download file
			</CSVDownloader>
		</div>
	)
	}else{
		<div className="div--save-data">
		</div>
	}

}
export default SaveFile;
