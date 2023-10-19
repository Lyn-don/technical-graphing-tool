import React, { useState, useRef, useEffect } from "react";
//import as papa * from "papaparse"
//import { invoke } from "@tauri-apps/api/tauri";

import ImportUserFile from "./components/ImportUserFile";
import GraphCandles from "./components/GraphCandles";
import SelectColumns from "./components/SelectColumns";

import "./styles/App.css";

function App() {
	const [fileData, setFileData] = useState<object[]>([]);
	const [fileColumns, setFileColumns] = useState<string[]>([]);
	const [selectedData, setSelectedData] = useState<object[]>([]);
	const [message, setMessage] = useState<string>("Select a csv file.");
	const appRef = useRef<HTMLDivElement>(null);

	console.log(selectedData);

	//console.log(selectedData.slice(selectedData.length-25,selectedData.length));

	useEffect(() => {
		if (fileData.length > 1) {
			setMessage("Select columns to display.");
		}

		if (selectedData.length > 1) {
			setMessage("Double click on a candle to mark it.");
		}

		if (selectedData.length > 1 && fileData.length > 1) {
			setMessage("Click on the button to save the file.");
		}
	}, [fileData, selectedData]);

	return (
		<div ref={appRef} className="container">
			<div className="menu">
				<div className="menu-content">
					{message}
					<ImportUserFile
						setFileData={setFileData}
						setFileColumns={setFileColumns}
						setMessage={setMessage}
					/>

					<SelectColumns
						fileData={fileData}
						fileColumns={fileColumns}
						setSelectedData={setSelectedData}
					/>
				</div>
			</div>
			<GraphCandles selectedData={selectedData} fileData={fileData} />
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
