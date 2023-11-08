import React, { useEffect, useRef, useState } from "react";
import {
	createChart,
	ColorType,
	Logical,
	MouseEventParams,
} from "lightweight-charts";
import SaveFile from "../FileHandlingComponents/SaveFile";

import "../../styles/Chart.css";

type TOhlcv = {
	time: number | null;
	open: number | null;
	high: number | null;
	low: number | null;
	close: number | null;
	volume: number | null;
	ml_signal: number | null;
};

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
	const [highlightLastOpenCurrentClose, setHighlightLastOpenCurrentClose] =
		useState<number>(0);
	//number of highlighted candles
	const [highlightedCandlesCount, setHighlightedCandlesCount] =
		useState<number>(0);
	//lock any graph events
	const [lockEvent, setLockEvent] = useState<boolean>(false);
	//current graph width
	const [graphWidth, setGraphWidth] = useState<number>(0);

	useEffect(() => {
		console.log("GraphCandles useEffect");
		if (chartContainerRef.current && selectedData.length) {
			console.log(chartContainerRef.current?.clientHeight);
			//remove the previous chart from the last render
			if (chartContainerRef.current.children.length) {
				chartContainerRef.current.removeChild(
					chartContainerRef.current.children[0]
				);
			}

			let keys: string[] = Object.keys(selectedData[0]);

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

				width: chartContainerRef.current?.clientWidth,
				height: 1000,

				timeScale: {
					secondsVisible: true,
					ticksVisible: true,
					timeVisible: true,
				},
				rightPriceScale: {
					visible: true,
					borderVisible: true,
					autoScale: true,
				},
			});

			setGraphWidth(chartContainerRef.current?.clientWidth);
			/*
						
				
			*/
			if (chart) {
				setGraphMessage(
					"Double click on a candle to mark csv with 0.\nShift+Double-Click to mark with 1.\nAlt+Double-Click to mark the csv with -1.\nCtrl+Double-Click to delete connected marks.\n"
				);
			}

			//click candles to mark them
			function handleClick(param: MouseEventParams): void {
				if (
					param.sourceEvent &&
					param.time &&
					param.logical &&
					param.seriesData
				) {
					//extract the event candle data from the event
					let seriesDataCandle = Array.from(
						param.seriesData.values()
					)[0];
					//current event index
					let index = param.logical;
					//current event time
					let time = param.time;
					//current source event
					let sourceEvent = param.sourceEvent;

					//delete marks double click + ctrl
					if (param.sourceEvent.ctrlKey) {
						//skip if already null
						if (selectedData[index]["ml_signal"] == null) {
							console.log(selectedData[index]["ml_signal"]);
							console.log("already empty.");
							return;
						}

						//backfill the marks on the graph by 8
						let i: number = index;
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

				setClickEventObject(param);
				setLockEvent(false);
			}

			chart.subscribeDblClick((param) => {
				setLockEvent(true);
				if (!lockEvent) {
					handleClick(param);
				}
				setLockEvent(false);
			});

			function handleMouseMove(param: MouseEventParams): void {
				//console.log(chart.priceScale("right"));
				if (
					param.sourceEvent &&
					param.time &&
					param.logical &&
					param.seriesData
				) {
					//extract the event candle data from the event
					let seriesData = Array.from(param.seriesData.values());
					//current event index
					let index = param.logical;
					//current event time
					let time = param.time;
					//current source event
					let sourceEvent = param.sourceEvent;

					if (index) {
						let hoveredOverData = selectedData[index];
						setHoverOverValue(hoveredOverData);
					}
				}
			}

			chart.subscribeCrosshairMove((param) => {
				handleMouseMove(param);
				//set the current viewable range for the next time the graph is rendered
				//@ts-ignore
				setFrom(chart.timeScale().getVisibleLogicalRange().from);
				//@ts-ignore
				setTo(chart.timeScale().getVisibleLogicalRange().to);
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
							top: 0.8, // highest point of the series will be 70% away from the top
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

				if (highlightLastOpenCurrentClose) {
					console.log(highlightLastOpenCurrentClose);

					let selectedDataCopy = selectedData;

					for (let i = 1; i < selectedDataCopy.length; i++) {
						if (
							(Math.abs(
								selectedDataCopy[i - 1].open -
									selectedDataCopy[i].close
							) /
								selectedDataCopy[i - 1].open) *
								100 <
							highlightLastOpenCurrentClose
						) {
							selectedDataCopy[i].color = "orange";
							selectedDataCopy[i].wickColor = "orange";
						} else {
							selectedDataCopy[i].color = null;
							selectedDataCopy[i].wickColor = null;
						}
					}

					candlestickSeries.setData(selectedDataCopy);
					setHighlightedCandlesCount(
						selectedDataCopy.filter((el) => el.color == "orange")
							.length
					);
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
					console.log(chartContainerRef.current?.clientWidth);
					console.log(chartContainerRef.current?.clientHeight);

					chart.applyOptions({
						width: chartContainerRef.current?.clientWidth,
						height: chartContainerRef.current?.clientHeight,
					});
					setGraphWidth(chartContainerRef.current?.clientWidth);
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
	}, [
		selectedData,
		fileData,
		clickEventObject,
		highlightLastOpenCurrentClose,
	]);

	/*
	upColor: "#26a69a",
					downColor: "#ef5350",
	*/
	if (fileData.length && selectedData.length) {
		return (
			<div className="div--graph-historical-data-container">
				<div
					className="div--graph-historical-data"
					ref={chartContainerRef as React.RefObject<HTMLDivElement>}
				></div>
				<div className="div--graph-historical-hover-over-data-container">
					<ul
						className="ul--graph-historical-hover-over-data"
						style={{
							color:
								//@ts-ignore
								hoverOverValue.close > hoverOverValue.open
									? "#26a69a"
									: "#ef5350",
							width: `${graphWidth - 40}px`,
						}}
					>
						<li>
							Open:&nbsp;
							{
								//@ts-ignore
								hoverOverValue.open //@ts-ignore
									? hoverOverValue.open.toFixed(2)
									: null
							}
						</li>
						<li>
							High:&nbsp;
							{
								//@ts-ignore
								hoverOverValue.high //@ts-ignore
									? hoverOverValue.high.toFixed(2)
									: null
							}
						</li>
						<li>
							Low:&nbsp;
							{
								//@ts-ignore
								hoverOverValue.low //@ts-ignore
									? hoverOverValue.low.toFixed(2)
									: null
							}
						</li>
						<li>
							Close:&nbsp;
							{
								//@ts-ignore
								hoverOverValue.close //@ts-ignore
									? hoverOverValue.close.toFixed(2)
									: null
							}
						</li>
						<li>
							Volume:&nbsp;
							{
								//@ts-ignore
								hoverOverValue.volume //@ts-ignore
									? hoverOverValue.volume.toFixed(2)
									: null
							}
						</li>
						<li>
							Signal:&nbsp;
							{
								//@ts-ignore
								hoverOverValue.ml_signal !== null //@ts-ignore
									? hoverOverValue.ml_signal
									: null
							}
						</li>
					</ul>
				</div>

				<div className="div--graph-historical-data-sub-menu-wrapper">
					Open Close % Difference:
					<input
						className="input--graph-historical-open-close-difference"
						type="text"
						placeholder="50 or .01"
						onChange={(e) => {
							if (
								e.target.value == "" ||
								e.target.value == "0" ||
								!e.target.value
							) {
								setHighlightLastOpenCurrentClose(0);
							} else {
								setHighlightLastOpenCurrentClose(
									+e.target.value
								);
							}
						}}
					></input>
					{" Highlighted Count: " + highlightedCandlesCount}
					<SaveFile
						fileData={fileData}
						markedData={markedData}
						setMessage={setMessage}
					/>
				</div>
			</div>
		);
	} else {
		return <div className="div--graph-historical-data-container"></div>;
	}
}

export default GraphCandles;
