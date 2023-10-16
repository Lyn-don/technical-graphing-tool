import { createChart, ColorType, Time } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import "../styles/Graphs.css";

type Props = {
  selectedData: Array<object>;
  setSelectedData: React.Dispatch<React.SetStateAction<object>>;
};

function GraphCandles({ selectedData, setSelectedData }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>();
  const [mark, setMark] = useState<number>(0);
const [from,setFrom] = useState<Time>();
const [to,setTo] = useState<Time>();

  useEffect(() => {
    if (chartContainerRef.current?.children.length) {
      chartContainerRef.current.removeChild(
        chartContainerRef.current.children[0]
      );
    }

    if (selectedData.length > 1) {
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

	


      chart.subscribeDblClick((param) => {
        console.log(param);
        let index = selectedData.findIndex((el) => el.time == param.time);
        //skip if not last 8 candles
        if (index > selectedData.length - 8) return;
        //skip if already marked
        if (selectedData[index]["ml_signal"] == 1) return;
        //if any of the next 8 candles is already marked, skip
        let last8 = selectedData.slice(index-7, index);
        if (last8.some((el) => el["ml_signal"] == 1)) return;
	//backfill the marks on the graph by 8
        for (let i = index; i > index - 8; i--) {
          selectedData[i]["ml_signal"] = 1;
        }
	setFrom(chart.timeScale().getVisibleRange().from);
	setTo(chart.timeScale().getVisibleRange().to);
      	
        setSelectedData(selectedData);
        setMark(index);
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
        chart.applyOptions({
          width: chartContainerRef.current?.clientWidth,
          height: chartContainerRef.current?.clientWidth / 2,
        });
      };

	if(from && to){	
	chart.timeScale().setVisibleRange({from: from,to: to})
	}

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);

        chart.remove();
      };
    }
  }, [selectedData, mark]);

  return (
    <div className="div--graph-historical-selectedData-container">
      <div
        className="div--graph-historical-selectedData"
        ref={chartContainerRef}
      ></div>
    </div>
  );
}

export default GraphCandles;
