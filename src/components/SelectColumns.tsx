import React, { useEffect, useState } from "react";
import "../styles/SelectColumns.css";
interface Ohlcv {
  time: number | string;
  open: number | string;
  high: number | string;
  low: number | string;
  close: number | string;
  volume: number | string;
}

interface SelectColumns {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

interface Props {
  data: Array<Ohlcv>;
  setData: React.Dispatch<React.SetStateAction<object>>;
}

function SelectColumns({ data, setData }: Props) {
  const [columns, setColumns] = useState<Array<string>>([]);
  //const [graphData,setGraphData] = useState<Array<object>>([])
  const [selectedColumns, setSelectedColumns] = useState<SelectColumns>({
    time: "",
    open: "",
    high: "",
    low: "",
    close: "",
    volume: "",
  });

  useEffect(() => {
    if (data.length) {
      setColumns(Object.keys(data[0]));
      console.log(columns);
    }
  }, [data]);

  return (
    <div className="select-columns">
      <ul className="select-group">
        <li>
          <p>Time</p>
          <select
            onChange={(e) => {
              selectedColumns["time"] = e.target.value;
            }}
          >
            <option>Select one...</option>

            {columns.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        </li>
        <li>
          <p>Open</p>
          <select
            onChange={(e) => {
              selectedColumns["open"] = e.target.value;
            }}
          >
            <option>Select one...</option>

            {columns.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        </li>
        <li>
          <p>High</p>
          <select
            onChange={(e) => {
              selectedColumns["high"] = e.target.value;
            }}
          >
            <option>Select one...</option>

            {columns.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        </li>
        <li>
          <p>Low</p>
          <select
            onChange={(e) => {
              selectedColumns["low"] = e.target.value;
            }}
          >
            <option>Select one...</option>

            {columns.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        </li>
        <li>
          <p>Close</p>
          <select
            onChange={(e) => {
              selectedColumns["close"] = e.target.value;
            }}
          >
            <option>Select one...</option>

            {columns.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        </li>
        <li>
          <p>Volume</p>

          <select
            onChange={(e) => {
              selectedColumns["volume"] = e.target.value;
            }}
          >
            <option>Select one...</option>
            {columns.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        </li>      <button
        onClick={function () {
          console.log(selectedColumns);
	  let o = Object.keys(selectedColumns).filter((k) => selectedColumns[k] != null).reduce((a, k) => ({ ...a, [k]: selectedColumns[k] }), {});
		console.log(o)
          //get a list of the not used columns
		
		let selected_data = data.map((el)=>{
			
			return{
				
			}
		})

	  /*
          let open = data.map((el) => el[selectedColumns["open"]]);
          let high = data.map((el) => el[selectedColumns["high"]]);
          let low = data.map((el) => el[selectedColumns["low"]]);
          let close = data.map((el) => el[selectedColumns["close"]]);
          let volume = data.map((el) => el[selectedColumns["volume"]]);
	
		
	let selected_data = data.map((el)=>{
		
		let new_array = []
		time: new Date(el["time"]).valueOf(),
		open: +el["open"],
		high: +el["high"],
		low: +el["low"],
		close: +el["close"],
		volume: +el["volumne"]}
		let drop_column = []
		column.forEach(item){
			if(new_array.map(arr => arr[item]).includes(NaN)){
				
			}
		}
	})*/

          let testArrays: Array<Array<number | Date>> = [
            time,
            open,
            high,
            low,
            close,
            volume,
          ];
          console.log(time);

          setData(data);
        }}
      >
        Graph Columns
      </button>

      </ul>
    </div>
  );
}

export default SelectColumns;
