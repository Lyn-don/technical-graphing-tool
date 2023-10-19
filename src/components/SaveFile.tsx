import { useState, useEffect } from "react";
import { useCSVDownloader, jsonToCSV } from "react-papaparse";

function combineArrayObjects(
	arr1: Array<object>,
	arr2: Array<object>
): Array<object> {
	let result: Array<object> = [];

	if (arr1.length != arr2.length) {
		console.log("Arrays must be of equal length");
		return result;
	}

	for (let i = 0; i < arr1.length; i++) {
		result.push(Object.assign({}, arr1[i], arr2[i]));
	}
	console.log(result);
	return result;
}

type Props = {
	fileData: Array<object>;
	markedData: Array<object>;
};

function SaveFile({ fileData, markedData }: Props) {
	const { CSVDownloader, Type } = useCSVDownloader();
	const [data, setData] = useState<object[]>([]);

	useEffect(() => {
		if (fileData.length && markedData.length) {
			console.log("fileData");
			console.log(fileData);
			console.log("markedData");
			console.log(markedData);

			setData(combineArrayObjects(fileData, markedData));
		}
		console.log("fileData");
		console.log(fileData);
		console.log("markedData");
		console.log(markedData);
	}, [fileData, markedData]);

	if (data) {
		return (
			<div className="div--save-data">
				<CSVDownloader
					type={Type.Button}
					filename={"test2"}
					bom={true}
					config={{ delimiter: "," }}
					data={data}
				>
					Download file
				</CSVDownloader>
			</div>
		);
	} else {
		return <div className="div--save-data"></div>;
	}
}
export default SaveFile;
