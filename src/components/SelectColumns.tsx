import React, { useEffect, useState } from "react";
import "../styles/SelectColumns.css";
type TOhlcv = {
	time: number;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	ml_signal: number;
};

type TUserColumns = {
	time: string;
	open: string;
	high: string;
	low: string;
	close: string;
	volume: string;
	ml_signal: string;
};

type TSelectedColumns = {
	fileData: object[];
	fileColumns: string[];
	setSelectedData: React.Dispatch<React.SetStateAction<object[]>>;
	setMessage: React.Dispatch<React.SetStateAction<string>>;
};

function SelectColumns({
	fileData,
	fileColumns,
	setSelectedData,
	setMessage,
}: TSelectedColumns) {
	const [selectedColumns, setSelectedColumns] = useState<TUserColumns>({
		time: "",
		open: "",
		high: "",
		low: "",
		close: "",
		volume: "",
		ml_signal: "",
	});

	const selectRef = React.createRef<HTMLSelectElement>();
	const selectRef2 = React.createRef<HTMLSelectElement>();
	const selectRef3 = React.createRef<HTMLSelectElement>();
	const selectRef4 = React.createRef<HTMLSelectElement>();
	const selectRef5 = React.createRef<HTMLSelectElement>();
	const selectRef6 = React.createRef<HTMLSelectElement>();
	const selectRef7 = React.createRef<HTMLSelectElement>();

	useEffect(() => {
		if (fileData.length > 1) {
			selectRef.current!.value = "Select one...";
			selectRef2.current!.value = "Select one...";
			selectRef3.current!.value = "Select one...";
			selectRef4.current!.value = "Select one...";
			selectRef5.current!.value = "Select one...";
			selectRef6.current!.value = "Select one...";
			selectRef7.current!.value = "Select one...";
		}
	}, [fileData]);

	if (fileData.length > 1) {
		return (
			<div className="select-columns">
				<ul className="select-group">
					<li>
						<p>Time</p>
						<select
							ref={selectRef}
							onChange={(e) => {
								selectedColumns["time"] = e.target.value;
							}}
						>
							<option>Select one...</option>

							{fileColumns.map((option, index) => (
								<option key={index}>{option}</option>
							))}
						</select>
					</li>
					<li>
						<p>Open</p>
						<select
							ref={selectRef2}
							onChange={(e) => {
								selectedColumns["open"] = e.target.value;
							}}
						>
							<option>Select one...</option>

							{fileColumns.map((option, index) => (
								<option key={index}>{option}</option>
							))}
						</select>
					</li>
					<li>
						<p>High</p>
						<select
							ref={selectRef3}
							onChange={(e) => {
								selectedColumns["high"] = e.target.value;
							}}
						>
							<option>Select one...</option>

							{fileColumns.map((option, index) => (
								<option key={index}>{option}</option>
							))}
						</select>
					</li>
					<li>
						<p>Low</p>
						<select
							ref={selectRef4}
							onChange={(e) => {
								selectedColumns["low"] = e.target.value;
							}}
						>
							<option>Select one...</option>

							{fileColumns.map((option, index) => (
								<option key={index}>{option}</option>
							))}
						</select>
					</li>
					<li>
						<p>Close</p>
						<select
							ref={selectRef5}
							onChange={(e) => {
								selectedColumns["close"] = e.target.value;
							}}
						>
							<option>Select one...</option>

							{fileColumns.map((option, index) => (
								<option key={index}>{option}</option>
							))}
						</select>
					</li>
					<li>
						<p>Volume</p>

						<select
							ref={selectRef6}
							onChange={(e) => {
								selectedColumns["volume"] = e.target.value;
							}}
						>
							<option>Select one...</option>
							{fileColumns.map((option, index) => (
								<option key={index}>{option}</option>
							))}
						</select>
					</li>
					<li>
						<p>Signal</p>

						<select
							ref={selectRef7}
							onChange={(e) => {
								selectedColumns["ml_signal"] = e.target.value;
							}}
						>
							<option>Select one...</option>
							{fileColumns.map((option, index) => (
								<option key={index}>{option}</option>
							))}
						</select>
					</li>
					<button
						onClick={function () {
							console.log(fileData);

							console.log(selectedColumns);

							let processFileData = fileData.map(function (
								el: any
							): TOhlcv {
								return {
									time: (new Date(
										el[
											selectedColumns[
												"time"
											] as keyof typeof el
										]
									).getTime() / 1000) as number,
									open: +el[
										selectedColumns[
											"open"
										] as keyof typeof el
									],
									high: +el[
										selectedColumns[
											"high"
										] as keyof typeof el
									],
									low: +el[
										selectedColumns[
											"low"
										] as keyof typeof el
									],
									close: +el[
										selectedColumns[
											"close"
										] as keyof typeof el
									],
									volume: +el[
										selectedColumns[
											"volume"
										] as keyof typeof el
									],
									ml_signal:
										+el[
											selectedColumns[
												"ml_signal"
											] as keyof typeof el
										],
								};
							});

							console.log(processFileData);

							let selectedFileData = processFileData.map((el) => {
								let o = Object.keys(selectedColumns).filter(
									(k) =>
										selectedColumns[
											k as keyof typeof selectedColumns
										] !== ""
								);

								let obj: { [key: string]: any } = {}; // add index signature to allow indexing with a string
								o.forEach((col_names) => {
									obj[col_names] =
										el[col_names as keyof typeof el];
								});
								return obj;
							});

							if (
								!Object.keys(selectedFileData[0]).includes(
									"ml_signal"
								)
							) {
								console.log("HELLO!");
								selectedFileData = selectedFileData.map(
									(array) => ({
										...array,
										ml_signal: null,
									})
								);
							}
							console.log("RRRRR!W");
							console.log(selectedFileData);
							console.log(selectedColumns);

							let selectColumnsKeys: string[] =
								Object.keys(selectedColumns);
							for (let i = 1; i < selectColumnsKeys.length; i++) {
								const key = selectColumnsKeys[
									i
								] as keyof TUserColumns;
								if (selectedColumns[key] === "Select one...") {
									selectedColumns[key] = "";
								}
							}

							if (
								selectedColumns["time"] == "" ||
								selectedColumns["open"] == "" ||
								selectedColumns["high"] == "" ||
								selectedColumns["low"] == "" ||
								selectedColumns["close"] == ""
							) {
								setSelectedColumns({
									time:
										selectedColumns["time"] == ""
											? ""
											: selectedColumns["time"],
									open:
										selectedColumns["open"] == ""
											? ""
											: selectedColumns["open"],
									high:
										selectedColumns["high"] == ""
											? ""
											: selectedColumns["high"],
									low:
										selectedColumns["low"] == ""
											? ""
											: selectedColumns["low"],
									close:
										selectedColumns["close"] == ""
											? ""
											: selectedColumns["close"],
									volume:
										selectedColumns["volume"] == ""
											? ""
											: selectedColumns["volume"],
									ml_signal:
										selectedColumns["ml_signal"] == ""
											? ""
											: selectedColumns["ml_signal"],
								});
								setMessage(
									"Please select a option for Time Open High Low Close"
								);
							} else {
								setSelectedData(selectedFileData);
							}
						}}
					>
						Graph Columns
					</button>
				</ul>
			</div>
		);
	} else {
		return <div className="select-columns"></div>;
	}
}

export default SelectColumns;
