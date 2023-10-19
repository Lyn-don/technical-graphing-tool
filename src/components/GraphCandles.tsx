import { createChart, ColorType, Time, Logical } from "lightweight-charts";
import SaveFile from "./SaveFile";
import React, { useEffect, useRef, useState } from "react";
import "../styles/Graphs.css";

type Props = {
	selectedData: any[];
	fileData: Array<object>;
};

function GraphCandles({ selectedData, fileData }: Props) {
	const chartContainerRef = useRef<HTMLDivElement>();
	const [clickEventObject, setClickEventObject] = useState<object>({});
	//current viewable min x
	const [from, setFrom] = useState<Logical>();
	//current viewable max x
	const [to, setTo] = useState<Logical>();
	//array of 1 and 0, 1 means marked
	const [markedData, setMarkedData] = useState<Array<object>>([]);

	useEffect(() => {
		if (chartContainerRef.current) {
			if (chartContainerRef.current.children.length) {
				chartContainerRef.current.removeChild(
					chartContainerRef.current.children[0]
				);
			}

			let keys = Object.keys(selectedData[0]);

			let chart = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: "white" },
					textColor: "black",
				},
				width: chartContainerRef.current?.clientWidth,
				height: chartContainerRef.current?.clientWidth / 2,
				timeScale: {
					secondsVisible: true,
					ticksVisible: true,
					timeVisible: true,
				},
			});

			//click candles to mark them
			function handleClick(param: any): void {
				console.log(param);

				let index = selectedData.findIndex(
					(el) => el.time == param.time
				);
				console.log(index);
				console.log("selectedData");
				console.log(selectedData[index]);

				if (param.sourceEvent.shiftKey) {
					//skip if already marked
					if (selectedData[index]["ml_signal"] == 0) return;

					//backfill the marks on the graph by 8
					let i = index;
					while (selectedData[i]["ml_signal"] == 1) {
						selectedData[i]["ml_signal"] = 0;
						i++;
					}

					i = index - 1;

					while (selectedData[i]["ml_signal"] == 1) {
						selectedData[i]["ml_signal"] = 0;
						i--;
					}
				} else {
					//skip if already marked
					if (selectedData[index]["ml_signal"] == 1) return;
					//if any of the next 8 candles is already marked, skip
					let last8 = selectedData.slice(index - 7, index);
					if (last8.some((el) => el["ml_signal"] == 1)) return;
					//backfill the marks on the graph by 8
					for (let i = index; i > index - 8; i--) {
						selectedData[i]["ml_signal"] = 1;
					}
				}
				//set the current viewable range

				//@ts-ignore
				setFrom(chart.timeScale().getVisibleLogicalRange().from);
				//@ts-ignore
				setTo(chart.timeScale().getVisibleLogicalRange().to);

				setMarkedData(
					selectedData.map((el) => {
						return {
							ml_signal: el.ml_signal,
						};
					})
				);
				setClickEventObject(param);
			}

			chart.subscribeDblClick((param) => {
				handleClick(param);
			});

			if (keys.includes("time") && keys.length > 4) {
				const candlestickSeries = chart.addCandlestickSeries({
					upColor: "#26a69a",
					downColor: "#ef5350",
					borderVisible: false,
					wickUpColor: "#26a69a",
					wickDownColor: "#ef5350",
				});
				let markData = selectedData.filter((d) => d["ml_signal"] == 1);
				markData = markData.map((d) => {
					return {
						time: d["time"],
						position: "aboveBar",
						color: "blue",
						shape: "circle",
					};
				});

				candlestickSeries.setData(selectedData);
				candlestickSeries.setMarkers(markData);
			}

			const handleResize = () => {
				if (chartContainerRef.current) {
					chart.applyOptions({
						width: chartContainerRef.current?.clientWidth,
						height: chartContainerRef.current?.clientWidth / 2,
					});
				}
			};

			if (from && to) {
				chart
					.timeScale()
					.setVisibleLogicalRange({ from: from, to: to });
			}

			console.log("selectedData");
			console.log(selectedData);
			console.log("fileData");
			console.log(fileData);

			//Events:

			//window resize event
			window.addEventListener("resize", handleResize);

			return () => {
				window.removeEventListener("resize", handleResize);
				chart.remove();
			};
		}
	}, [selectedData, fileData, clickEventObject]);

	if (fileData.length && selectedData.length) {
		return (
			<div className="div--graph-historical-selectedData-container">
				<div
					className="div--graph-historical-selectedData"
					ref={chartContainerRef as React.RefObject<HTMLDivElement>}
				></div>
				<SaveFile fileData={fileData} markedData={markedData} />
			</div>
		);
	} else {
		return (
			<div className="div--graph-historical-selectedData-container"></div>
		);
	}
}

export default GraphCandles;
