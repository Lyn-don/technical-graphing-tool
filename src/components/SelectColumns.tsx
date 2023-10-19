import React, { useEffect, useState } from "react";
import "../styles/SelectColumns.css";

interface Ohlcv {
  time: number | string;
  open: number | string;
  high: number | string;
  low: number | string;
  close: number | string;
  volume: number | string;
  ml_signal: number | string;
}

interface SelectColumns {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  ml_signal: string;
}

interface Props {
  fileData: Array<Ohlcv>;
  fileColumns: Array<string>;
  setSelectedData: React.Dispatch<React.SetStateAction<object>>;
}

function SelectColumns({ fileData, fileColumns, setSelectedData }: Props) {
  const [selectedColumns, setSelectedColumns] = useState<SelectColumns>({
    time: "",
    open: "",
    high: "",
    low: "",
    close: "",
    volume: "",
    ml_signal: "",
  });

  const selectRef = React.createRef<HTMLSelectElement>();
  const selectRef2 = React.createRef<HTMLSelectElement>();
  const selectRef3 = React.createRef<HTMLSelectElement>();
  const selectRef4 = React.createRef<HTMLSelectElement>();
  const selectRef5 = React.createRef<HTMLSelectElement>();
  const selectRef6 = React.createRef<HTMLSelectElement>();
  const selectRef7 = React.createRef<HTMLSelectElement>();

  useEffect(() => {
    if (fileData.length > 1) {
      selectRef.current!.value = "Select one...";
      selectRef2.current!.value = "Select one...";
      selectRef3.current!.value = "Select one...";
      selectRef4.current!.value = "Select one...";
      selectRef5.current!.value = "Select one...";
      selectRef6.current!.value = "Select one...";
      selectRef7.current!.value = "Select one...";
    }
  }, [fileData]);

  if (fileData.length > 1) {
    return (
      <div className="select-columns">
        <ul className="select-group">
          <li>
            <p>Time</p>
            <select
              ref={selectRef}
              onChange={(e) => {
                selectedColumns["time"] = e.target.value;
              }}
            >
              <option>Select one...</option>

              {fileColumns.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </li>
          <li>
            <p>Open</p>
            <select
              ref={selectRef2}
              onChange={(e) => {
                selectedColumns["open"] = e.target.value;
              }}
            >
              <option>Select one...</option>

              {fileColumns.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </li>
          <li>
            <p>High</p>
            <select
              ref={selectRef3}
              onChange={(e) => {
                selectedColumns["high"] = e.target.value;
              }}
            >
              <option>Select one...</option>

              {fileColumns.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </li>
          <li>
            <p>Low</p>
            <select
              ref={selectRef4}
              onChange={(e) => {
                selectedColumns["low"] = e.target.value;
              }}
            >
              <option>Select one...</option>

              {fileColumns.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </li>
          <li>
            <p>Close</p>
            <select
              ref={selectRef5}
              onChange={(e) => {
                selectedColumns["close"] = e.target.value;
              }}
            >
              <option>Select one...</option>

              {fileColumns.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </li>
          <li>
            <p>Volume</p>

            <select
              ref={selectRef6}
              onChange={(e) => {
                selectedColumns["volume"] = e.target.value;
              }}
            >
              <option>Select one...</option>
              {fileColumns.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </li>
          <li>
            <p>Signal</p>

            <select
              ref={selectRef7}
              onChange={(e) => {
                selectedColumns["ml_signal"] = e.target.value;
              }}
            >
              <option>Select one...</option>
              {fileColumns.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </li>
          <button
            onClick={function () {
              console.log(fileData);

              console.log(selectedColumns);

              let processFileData = fileData.map((el: Ohlcv) => {
                return {
                  time: new Date(el[selectedColumns["time"]]).valueOf() / 1000,
                  open: +el[selectedColumns["open"]],
                  high: +el[selectedColumns["high"]],
                  low: +el[selectedColumns["low"]],
                  close: +el[selectedColumns["close"]],
                  volume: +el[selectedColumns["volume"]],
                  ml_signal: +el[selectedColumns["ml_signal"]],
                };
              });

              console.log(processFileData);

              let selectedFileData = processFileData.map((el) => {
                let o = Object.keys(selectedColumns).filter(
                  (k) => selectedColumns[k] != ""
                );
                let obj = {};
                o.forEach((col_names) => {
                  obj[col_names] = el[col_names];
                });
                return obj;
              });

              if (!Object.keys(selectedFileData[0]).includes("ml_signal")) {
                console.log("HELLO!");
                selectedFileData = selectedFileData.map((array) => ({
                  ...array,
                  ml_signal: 0,
                }));
              }

              console.log(selectedFileData);
              setSelectedData(selectedFileData);
            }}
          >
            Graph Columns
          </button>
        </ul>
      </div>
    );
  } else {
    return <div className="select-columns"></div>;
  }
}

export default SelectColumns;
