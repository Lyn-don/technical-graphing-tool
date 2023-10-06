import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

function CandleStickGraph({data}){
	
	const chartContainerRef = useRef<HTMLElement|null>(null);

	useEffect(() => {
		if(data.length){
			console.log(data)

			function handleResize(){
				chart.applyOptions({ width: chartContainerRef.current.clientWidth });
			}
	

			let chart = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: "white" },
					textColor: "black",
				},
				width: chartContainerRef.current.clientWidth,
				height: 300,
			});
			chart.timeScale().fitContent();
			
			

			const newSeries = chart.addAreaSeries({lineColor:"#2962FF",topColor: "#2962FF", bottomColor: "rgba(41, 98, 255, 0.28)"});
			newSeries.setData(data)
			
			
			window.addEventListener('resize', handleResize);
			/*
			return () => {
				window.removeEventListener('resize', handleResize);

				chart.remove();
			};*/
			}
		},[data]);

	return (
		<div
			ref={chartContainerRef}
		/>
	);
};


export default CandleStickGraph;
