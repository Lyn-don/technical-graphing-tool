import React, { useEffect, useRef, useState } from "react";
import {createChart,ColorType,Logical,MouseEventParams} from "lightweight-charts";
import SaveFile from "../FileHandlingComponents/SaveFile";

import "../../styles/Chart.css";

type Props = {
	selectedData: any[];
	fileData: Array<object>;
	setMessage: React.Dispatch<React.SetStateAction<string>>;
	setGraphMessage: React.Dispatch<React.SetStateAction<string>>;
	timePeriodAmount: number;
};

function GraphCandles({
	selectedData,
	fileData,
	setMessage,
	setGraphMessage,
	timePeriodAmount,
}: Props) {
	const chartContainerRef = useRef<HTMLDivElement>();
	const [clickEventObject, setClickEventObject] = useState<object>({});
	//current viewable min x
	const [from, setFrom] = useState<Logical>();
	//current viewable max x
	const [to, setTo] = useState<Logical>();
	//array of 1 and 0, 1 means marked
	const [markedData, setMarkedData] = useState<Array<object>>([]);
	//hover over value
	const [hoverOverValue, setHoverOverValue] = useState<object>({});
	//highlight open close difference
	const [highlightOpenClose, setHighlightOpenClose] = useState<number>(0);	
	//number of highlighted candles
	const [highlightedCandlesCount, setHighlightedCandlesCount] = useState<number>(0);
	//lock any graph events
	const [lockEvent, setLockEvent] = useState<boolean>(false);


	useEffect(() => {
		if (chartContainerRef.current && selectedData.length) {
			//remove the previous chart
			if (chartContainerRef.current.children.length) {
				chartContainerRef.current.removeChild(
					chartContainerRef.current.children[0]
				);
			}

			let keys:string[] = Object.keys(selectedData[0]);

			let chart = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: "black" },
					textColor: "white",
				},
				grid: {
					vertLines: {
						color: "rgba(197, 203, 206, 0.5)",
						style: 1,
						visible: true,
					},
					horzLines: {
						color: "rgba(197, 203, 206, 0.5)",
						style: 1,
						visible: true,
					},
				},
				width: chartContainerRef.current?.clientWidth / 1.01,
				height: chartContainerRef.current?.clientWidth / 2.75,

				timeScale: {
					secondsVisible: true,
					ticksVisible: true,
					timeVisible: true,
				},
			});
			if (chart) {
				setGraphMessage(
					"Double click on a candle to mark csv with 0.\nShift+Double-Click to mark with 1.\nAlt+Double-Click to mark the csv with -1.\nCtrl+Double-Click to delete connected marks.\n"
				);
			}
			//click candles to mark them
			function handleClick(param: MouseEventParams): void {
			

				if (param.sourceEvent&&param.time&&param.logical) {
			
					let index = param.logical;

					//delete marks double click + ctrl
					if (param.sourceEvent.ctrlKey) {
						//skip if already null
						if (selectedData[index]["ml_signal"] == null) {
							console.log("already empty.");
							return;
						}

						//backfill the marks on the graph by 8
						let i:number = index;
						while (selectedData[i]["ml_signal"] != null) {
							selectedData[i]["ml_signal"] = null;
							i++;
						}

						i = index - 1;

						while (selectedData[i]["ml_signal"] != null) {
							selectedData[i]["ml_signal"] = null;
							i--;
						}
					}

					if (!param.sourceEvent.ctrlKey) {
						//skip if already marked
						if (selectedData[index]["ml_signal"] != null) {
							console.log("already marked");
							return;
						}

						//if any of the next 8 candles is already marked, skip
						let last8 = selectedData.slice(index - 7, index);
						if (last8.some((el) => el["ml_signal"] != null)) {
							return;
						}

						if (param.sourceEvent.shiftKey) {
							//backfill the marks on the graph by 8 with 1
							for (let i = index; i > index - 8; i--) {
								selectedData[i]["ml_signal"] = 1;
							}
						} else if (param.sourceEvent.altKey) {
							//backfill the marks on the graph by 8 with -1
							for (let i = index; i > index - 8; i--) {
								selectedData[i]["ml_signal"] = -1;
							}
						} else if (
							!param.sourceEvent.ctrlKey &&
							!param.sourceEvent.shiftKey &&
							!param.sourceEvent.altKey &&
							!param.sourceEvent.metaKey
						) {
							//backfill the marks on the graph by 8 with 0
							for (let i = index; i > index - 8; i--) {
								selectedData[i]["ml_signal"] = 0;
							}
						}
					}
					
				}
			

				setMarkedData(
					selectedData.map((el) => {
						return {
							ml_signal: el.ml_signal,
						};
					})
				);
				
				setClickEventObject(param);setLockEvent(false);
			}

			chart.subscribeDblClick((param) => {
					setLockEvent(true);
				if(!lockEvent){
				handleClick(param);
				}
				setLockEvent(false);
			});

			function handleMouseMove(param: MouseEventParams): void {

				if (param&&param.time) {
					//find the index of the time without iterating through the array
					let index = param.logical

					if(index){
						let hoveredOverData = selectedData[index];
						setHoverOverValue(hoveredOverData);
					}			
									
				}
					
			}

			chart.subscribeCrosshairMove((param) => {
				setLockEvent(true);
				if(!lockEvent){
					handleMouseMove(param);
				}
				setLockEvent(false);

				//set the current viewable range for the next time the graph is rendered
				//@ts-ignore
				setFrom(chart.timeScale().getVisibleLogicalRange().from);
				//@ts-ignore
				setTo(chart.timeScale().getVisibleLogicalRange().to);

				//console.log(param);
				//console.log(chart);
				//console.log(selectedData);
				console.log(chart.priceScale("left").width());
			});

		

			if (keys.includes("time") && keys.length > 4) {
				
				const candlestickSeries = chart.addCandlestickSeries({
					upColor: "#26a69a",
					downColor: "#ef5350",
					borderVisible: false,
					wickUpColor: "#26a69a",
					wickDownColor: "#ef5350",
				});

				let markData1 = selectedData.filter((d) => d["ml_signal"] == 1);

				markData1 = markData1.map((d) => {
					return {
						time: d["time"],
						position: "aboveBar",
						color: "blue",
						shape: "circle",
					};
				});

				let markData0 = selectedData.filter((d) => d["ml_signal"] == 0);
				markData0 = markData0.map((d) => {
					return {
						time: d["time"],
						position: "aboveBar",
						color: "red",
						shape: "circle",
					};
				});

				let markDataN1 = selectedData.filter(
					(d) => d["ml_signal"] == -1
				);

				markDataN1 = markDataN1.map((d) => {
					return {
						time: d["time"],
						position: "aboveBar",
						color: "yellow",
						shape: "circle",
					};
				});

				//concat all the mark data together
				let markData = markData1.concat(markData0);
				markData = markData.concat(markDataN1);
				markData = markData.sort((a, b) => a.time - b.time);

				if (Object.keys(selectedData[0]).includes("volume")) {
			

					let volumeHistogram = chart.addHistogramSeries({
						priceFormat: {
							type: "volume",
						},
						priceScaleId: "", // set as an overlay by setting a blank priceScaleId
					});

					volumeHistogram.priceScale().applyOptions({
						// set the positioning of the volume series
						scaleMargins: {
							top: 0.75, // highest point of the series will be 70% away from the top
							bottom: 0,
						},
					});

					let volumeData = selectedData.map((el) => {
						return {
							time: el.time,
							value: el.volume,
							color: el.open < el.close ? "#1d7d74" : "#ab3a38",
						};
					});

					volumeHistogram.setData(volumeData);
				}

				if (highlightOpenClose) {
					console.log(highlightOpenClose);

					let selectedDataCopy = selectedData;

					for (let i = 1; i < selectedDataCopy.length; i++) {
						if (
							Math.abs(
								selectedDataCopy[i - 1].open -
									selectedDataCopy[i].close
							) > highlightOpenClose
						) {
							selectedDataCopy[i].color = "orange";
							selectedDataCopy[i].wickColor = "orange";
						} else {
							selectedDataCopy[i].color = null;
							selectedDataCopy[i].wickColor = null;
						}
					}

					candlestickSeries.setData(selectedDataCopy);
					setHighlightedCandlesCount(selectedDataCopy.filter((el)=>el.color=="orange").length);
				} else {
					candlestickSeries.setData(
						selectedData.map((el) => {
							return {
								...el,
								color: null,
								wickColor: null,
							};
						})
					);
				}


				candlestickSeries.setMarkers(markData);
			}

			const handleResize = () => {
				if (chartContainerRef.current) {
					chart.applyOptions({
						width: chartContainerRef.current?.clientWidth / 1.01,
						height: chartContainerRef.current?.clientWidth / 2.75,
					});
				}
			};

			if (from && to) {
				chart
					.timeScale()
					.setVisibleLogicalRange({ from: from, to: to });
			}


			//Events:
			//window resize event
			window.addEventListener("resize", handleResize);

			return () => {
				window.removeEventListener("resize", handleResize);
				chart.remove();
			};
		}
	}, [selectedData, fileData, clickEventObject, highlightOpenClose, ]);

	/*
	upColor: "#26a69a",
					downColor: "#ef5350",
	*/
	if (fileData.length && selectedData.length) {
		return (
			<div className="div--graph-historical-data-container">
				<div className="div--graph-historical-hover-over-data-wrapper">
					<input
					className="input--graph-historical-open-close-difference"
						type="text"
						placeholder="Highlight open close difference"
						onChange={(e) => {
							if (
								e.target.value == "" ||
								e.target.value == "0" ||
								!e.target.value
							) {
								setHighlightOpenClose(0);
							} else {
								setHighlightOpenClose(+e.target.value);
							}
						
						}}
					></input>{" Highlighted Count:"+highlightedCandlesCount}
					<div className="div--graph-historical-hover-over-data-container">
					<ul className="ul--graph-historical-hover-over-data" style={
						//@ts-ignore
						{color: hoverOverValue.close > hoverOverValue.open ? "#26a69a" : "#ef5350" }}>
						<li>
							Open:
							{
								//@ts-ignore
								hoverOverValue.open? hoverOverValue.open.toFixed(2)
									: null	
							}
						</li>
						<li>
							High:
							{
								//@ts-ignore
								hoverOverValue.high? hoverOverValue.high.toFixed(2)
									: null
							}
						</li>
						<li>
							Low:
							{
								//@ts-ignore
								hoverOverValue.low? hoverOverValue.low.toFixed(2)
									: null
							}
						</li>
						<li>
							Close:
							{
								//@ts-ignore
								hoverOverValue.close? hoverOverValue.close.toFixed(2)
									: null
							}
						</li>
						<li>
							Volume:
							{
								//@ts-ignore
								hoverOverValue.volume? hoverOverValue.volume.toFixed(2)
									: null
							}
						</li>
						<li>
							Signal:
							{
								//@ts-ignore
								hoverOverValue.ml_signal!==null? hoverOverValue.ml_signal
									: null
							}
						</li>
					</ul>
					</div>
				</div>
				<div
					className="div--graph-historical-data"
					ref={chartContainerRef as React.RefObject<HTMLDivElement>}
				></div>
				<SaveFile
					fileData={fileData}
					markedData={markedData}
					setMessage={setMessage}
				/>
				
			</div>
		);
	} else {
		return <div className="div--graph-historical-data-container"></div>;
	}
}

export default GraphCandles;
