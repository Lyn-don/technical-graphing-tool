import { useRef, useState } from "react";
import { readString, readRemoteFile, usePapaParse } from "react-papaparse";
import Papa from "papaparse";

type TOhlcv = {
	time: number;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	ml_signal: number;
};

/*Compont Info:
 *A input component that gets the user csv the data is converted
 *to a array of objects and stored to the pareent useState.*/

type TImportUserFile = {
	setFileData: React.Dispatch<React.SetStateAction<object[]>>;
	setFileColumns: React.Dispatch<React.SetStateAction<Array<string>>>;
	setMessage: React.Dispatch<React.SetStateAction<string>>;
};

function ImportUserFile({
	setFileData,
	setFileColumns,
	setMessage,
}: TImportUserFile) {
	const inputFileRef = useRef<HTMLInputElement | null>(null);

	function getCsv(file: File) {
		setMessage("Loading in file...");
		let data: object[] = [];

		console.log(file);

		//@ts-ignore: readRemoteFile requires a string
		readRemoteFile(file, {
			header: true,
			skipEmptyLines: true,
			chunkSize: 2500000,
			worker: true,

			chunk: function (results: Papa.ParseResult<Array<string>>) {
				console.log(results.data);
				data.push(...results.data);

				setMessage(
					`Loading file\n${(results.meta.cursor / 1000000).toFixed(
						1
					)}/${(file.size / 1000000).toFixed(1)} MB`
				);

				//console.log("file size:",file.size,"buffer size",results.meta.cursor);
				//console.log(parseInt(file.size/10), parseInt(results.meta.cursor/10));
				if (
					Math.round(file.size / 10) ===
					Math.round(results.meta.cursor / 10)
				) {
					setFileData(data);

					if (results.meta.fields) {
						setFileColumns(results.meta.fields);
					}
					setMessage("File has been uploaded.");
				}
			},
		});
	}

	return (
		<div>
			<input
				onChange={(e) => {
					console.log(e);
					if (e.target.files && inputFileRef.current) {
						e.preventDefault();
						let fileSize: number = +e.target.files[0].size;
						console.log(fileSize);
						//checks if the file is not larger the 300 megabytes
						getCsv(e.target?.files[0]);
					}
				}}
				ref={inputFileRef}
				type="file"
				id="dataset_file"
				accept=".csv"
			/>
		</div>
	);
}

export default ImportUserFile;
