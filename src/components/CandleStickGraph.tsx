import { createChart, ColorType } from 'lightweight-charts';
import React,{ useEffect, useRef } from 'react';

type CandleStickGraphProps = {
	data:Array<object>
}

function CandleStickGraph({data}){
	
	const chartContainerRef = useRef<HTMLDivElement>();
		
	
	useEffect(() => {
		console.log(data.length);
		if(data.length>1){
			data = data.map((d)=>{
				
				return{time:d["time"]*1000,open:d["open"],high:d["high"],low:d["low"],close:d["close"]}
			})
			console.log(data)
			let chart = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: "white" },
					textColor:"black",
				},
				width: chartContainerRef.current?.clientWidth,
				height: 300,
			
		
			})
			const candlestickSeries = chart.addCandlestickSeries({
    				upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
    				wickUpColor: '#26a69a', wickDownColor: '#ef5350',
				
			});
			
			candlestickSeries.setData(data)
			console.log(chartContainerRef);
		}
		},[data]);

	return (
		<div className="graph"
			ref={chartContainerRef}
		/>
	);
};


export default CandleStickGraph;
