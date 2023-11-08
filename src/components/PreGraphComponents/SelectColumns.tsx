import React, { useEffect, useState } from "react";
import "../../styles/SelectColumns.css";
type TOhlcv = {
	time: number | null;
	open: number | null;
	high: number | null;
	low: number | null;
	close: number | null;
	volume: number | null;
	ml_signal: number | null;
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
	setTimePeriodAmount: React.Dispatch<React.SetStateAction<number>>;
};

function SelectColumns({
	fileData,
	fileColumns,
	setSelectedData,
	setMessage,
	setTimePeriodAmount,
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
		if (fileData.length > 1 && fileColumns.length > 1) {
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
			<div className="div--select-columns">
				<ul className="ul--select-group">
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
					<li className="div--button-select-columns-wrapper">
						<button
							className="button--select-columns"
							onClick={function () {
								let processFileData = fileData.map(function (
									el: any
								): TOhlcv {
									return {
										time: !+el[
											selectedColumns[
												"time"
											] as keyof typeof el
										]
											? ((new Date(
													el[
														selectedColumns[
															"time"
														] as keyof typeof el
													]
											  ).getTime() / 1000) as number)
											: +el[
													selectedColumns[
														"time"
													] as keyof typeof el
											  ].substring(0, 10),
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
											el[selectedColumns["ml_signal"]] !=
											""
												? +el[
														selectedColumns[
															"ml_signal"
														] as keyof typeof el
												  ]
												: null,
									};
								});

								let selectedFileData = processFileData.map(
									(el) => {
										let o = Object.keys(
											selectedColumns
										).filter(
											(k) =>
												selectedColumns[
													k as keyof typeof selectedColumns
												] !== ""
										);

										let obj: { [key: string]: any } = {}; // add index signature to allow indexing with a string
										o.forEach((col_names) => {
											obj[col_names] =
												el[
													col_names as keyof typeof el
												];
										});
										return obj;
									}
								);

								if (
									!Object.keys(selectedFileData[0]).includes(
										"ml_signal"
									)
								) {
									selectedFileData = selectedFileData.map(
										(array) => ({
											...array,
											ml_signal: null,
										})
									);
								}

								let selectColumnsKeys: string[] =
									Object.keys(selectedColumns);
								for (
									let i = 1;
									i < selectColumnsKeys.length;
									i++
								) {
									const key = selectColumnsKeys[
										i
									] as keyof TUserColumns;
									if (
										selectedColumns[key] === "Select one..."
									) {
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
									setTimePeriodAmount(
										Math.abs(
											selectedFileData[1].time -
												selectedFileData[0].time
										)
									);
									setSelectedData(selectedFileData);
								}
							}}
						>
							Graph Columns
						</button>
					</li>
				</ul>
			</div>
		);
	} else {
		return <div className="select-columns"></div>;
	}
}

export default SelectColumns;
