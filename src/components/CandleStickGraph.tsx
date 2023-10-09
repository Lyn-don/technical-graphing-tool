import { createChart, ColorType } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

type CandleStickGraphProps = {
	data:Array<object>
}

function CandleStickGraph({data}){
	
	const chartContainerRef = useRef<HTMLElement|null>(null);
		
	
	useEffect(() => {
		console.log(data.length);
		if(data.length>1){
			console.log(data)
			console.log(data.slice(data.length-10,data.length))

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

			console.log(newSeries)
			
			window.addEventListener('resize', handleResize);
			
			return () => {
				window.removeEventListener('resize', handleResize);

				chart.remove();
			};
			}
		},[data]);

	return (
		<div
			ref={chartContainerRef}
		/>
	);
};


export default CandleStickGraph;
