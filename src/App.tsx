import React, { useState, useRef, useEffect } from "react";
//import as papa * from "papaparse"
//import { invoke } from "@tauri-apps/api/tauri";

import ImportUserFile from "./components/FileHandlingComponents/ImportUserFile";
import GraphCandles from "./components/GraphComponents/GraphCandles";
import SelectColumns from "./components/PreGraphComponents/SelectColumns";

import "./styles/App.css";

function App() {
	const [fileData, setFileData] = useState<object[]>([]);
	const [fileColumns, setFileColumns] = useState<string[]>([]);
	const [selectedData, setSelectedData] = useState<object[]>([]);
	const [message, setMessage] = useState<string>("Select a csv file.");
	const [graphMessage, setGraphMessage] = useState<string>("");
	const [timePeriodAmount, setTimePeriodAmount] = useState<number>(0);
	const appRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (fileData.length > 1) {
			setMessage(
				"Select the Time Open High Low Close columns to make the candle graph."
			);
		}

		if (selectedData.length > 1 && fileData.length > 1) {
			setMessage("Graph plotted");
		}
	}, [fileData, selectedData]);

	return (
		<div ref={appRef} className="container"> 
			
			
			<GraphCandles
				selectedData={selectedData}
				fileData={fileData}
				setMessage={setMessage}
				setGraphMessage={setGraphMessage}
				timePeriodAmount={timePeriodAmount}
			/>{graphMessage}<div className="menu">
				<div className="menu-content">
					{message}
					<ImportUserFile
						setFileData={setFileData}
						setFileColumns={setFileColumns}
						setMessage={setMessage}
						setSelectedData={setSelectedData}
					/>

					<SelectColumns
						fileData={fileData}
						fileColumns={fileColumns}
						setSelectedData={setSelectedData}
						setMessage={setMessage}
						setTimePeriodAmount={setTimePeriodAmount}
					/>
				</div>
			</div>
		</div>
	);
}
{
	/*<div className="menu-button-wrapper">
           <button className="menu-button" onClick={(e) => {}}>
            <div className="menu-icon"></div>
            <div className="menu-icon"></div>
            <div className="menu-icon"></div>
          </button>
        </div>*/
}
export default App;
