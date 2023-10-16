import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef } from "react";
import "../styles/Graphs.css";

type Props = {
  selectedData: Array<object>;
  setSelectedData: React.Dispatch<React.SetStateAction<object>>;
};

function GraphCandles({ selectedData, setSelectedData }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>();
  const [mark, setMark] = React.useState<number>(0);
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

      chart.timeScale().fitContent();

      chart.subscribeDblClick((param) => {
        console.log(param);
        let index = selectedData.findIndex((el) => el.time == param.time);
        //skip if not last 8 candles
        if (index > selectedData.length - 8) return;
        //skip if already marked
        if (selectedData[index]["ml_signal"] == 1) return;

        //if any of the next 8 candles is already marked, skip
        let next8 = selectedData.slice(index, index + 8);
        if (next8.some((el) => el["ml_signal"] == 1)) return;

        for (let i = index; i < index + 8; i++) {
          selectedData[i]["ml_signal"] = 1;
        }
        console.log(selectedData.slice(index - 1, index + 9));
        console.log(param.sourceEvent);
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

        console.log(markData);

        candlestickSeries.setData(selectedData);
        candlestickSeries.setMarkers(markData);
      }
      /*
      if (keys.includes("time") && keys.length <= 4) {
        const newSeries = chart.addAreaSeries({
          lineColor: "#26a69a",
          topColor: "#26a69a",
        });

        let value_column: string = keys.filter(
          (el) => el != "time" && el != "volume"
        )[0];
        console.log(value_column);
        let lineData = selectedData.map((d) => {
          return {
            time: d["time"],
            value: d[value_column],
          };
        });
        console.log(lineData);
        newSeries.setData(lineData);
      }*/

      const handleResize = () => {
        console.log("resize");
        console.log(
          chartContainerRef.current?.clientWidth,
          chartContainerRef.current?.clientHeight
        );
        chart.applyOptions({
          width: chartContainerRef.current?.clientWidth,
          height: chartContainerRef.current?.clientWidth / 2,
        });
      };

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
