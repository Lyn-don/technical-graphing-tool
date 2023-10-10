import {useEffect,useState} from "react"
import Moment from "moment"


function SelectColumns({data,setData}){
	
	const [columns,setColumns] = useState<object>([]);
	//const [graphData,setGraphData] = useState<Array<object>>([])
	const [selectedColumns,setSelectedColumns] = useState({time:"",open:"",high:"",low:"",close:"",volume:""});


	useEffect(()=>{
		if(data.length){
			setColumns(Object.keys(data[0]));
			console.log(columns);
		}
	},[data])
		
	return(
		<div className="select-group">
				<ul>
					<li> 
						<p>Time</p>
						<select  onChange={(e)=>{

							selectedColumns["time"] = e.target.value;
						}}><option>
								Select one...
							</option>

							{columns.map((option,index)=>(
							<option key={index}>
								{option}
							</option>)
						)}
						</select>
					</li>
					<li> 
						<p>Open</p>
						<select   onChange={(e)=>{
							selectedColumns["open"] = e.target.value;
						}}><option>
								Select one...
							</option>

							{
							columns.map((option,index)=>(
							<option key={index}>
								{option}
							</option>)
						)}
						</select>
					</li>
					<li> 
						<p>High</p>
						<select  onChange={(e)=>{
							selectedColumns["high"] = e.target.value;
						}}><option>
								Select one...
							</option>

							{
							columns.map((option,index)=>(
							<option key={index}>
								{option}
							</option>)
						)}
						</select>
					</li>
					<li> 
						<p>Low</p>
						<select  onChange={(e)=>{
							selectedColumns["low"] = e.target.value;
						}}><option>
								Select one...
							</option>

							{
							columns.map((option,index)=>(
							<option key={index}>
								{option}
							</option>)
						)}
						</select>
					</li>
					<li> 
						<p>Close</p>
						<select  onChange={(e)=>{
							selectedColumns["close"] = e.target.value;
						}}><option>
								Select one...
							</option>

							{
							columns.map((option,index)=>(
							<option key={index}>
								{option}
							</option>)
						)}
						</select>
					</li>
					<li> 
						<p>Volume</p>

						<select  onChange={(e)=>{
							selectedColumns["volume"] = e.target.value;
						}}>
						<option>
							Select one...
						</option>
							{
							columns.map((option,index)=>(
							<option key={index}>
								{option}
							</option>)
						)}
						</select>
					</li>
				</ul>
				<button onClick={function(){

				/*setSelectedColumns({time:selectedColumns["time"],
						open:selectedColumns["open"],
						high:selectedColumns["high"],
						low:selectedColumns["low"],
						close:selectedColumns["close"],
						volume:selectedColumns["volume"]})
					console.log(selectedColumns["open"])
				*/
					let new_data = data.map(function(item:object){
						
						console.log(selectedColumns);

						return {time:Moment(item[selectedColumns["time"]]).unix(),
							open:+item[selectedColumns["open"]],
							high:+item[selectedColumns["high"]],
							low:+item[selectedColumns["low"]],
							close:+item[selectedColumns["close"]],
							volume:+item[selectedColumns["volume"]]}	
					})
				
					setData(new_data);
				}}>

				</button>
		</div>
	)
}

export default SelectColumns;
