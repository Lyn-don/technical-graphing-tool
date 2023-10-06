import { useState,useEffect } from "react";
import { createChart, ColorType } from "lightweight-charts";
function CandleStickGraphe({object_array}){
	const [graphData,setGraphData] = useState<Array<object>>([])

	useEffect(()=>{
		setGraphData(object_array)
	},[object_array])


}

export default CandleStickGraphe;
