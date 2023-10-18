import { useState, useEffect } from "react";
import { useCSVDownloader, jsonToCSV } from "react-papaparse";

function combineArrayObjects(
  arr1: Array<object>,
  arr2: Array<object>
): Array<object> {
  let result: Array<object> = [];

  if (arr1.length != arr2.length) {
    console.log("Arrays must be of equal length");
    return result;
  }

  for (let i = 0; i < arr1.length; i++) {
    result.push(Object.assign({}, arr1[i], arr2[i]));
  }
  console.log(result);
  return result;
}

type Props = {
  fileData: Array<object>;
  selectedData: Array<object>;
};

function SaveFile({ fileData, selectedData }: Props) {
  const [_fileData, setFileData] = useState<Array<object>>([]);
  const [_selectedData, setSelectedData] = useState<Array<object>>([]);
  const { CSVDownloader, Type } = useCSVDownloader();
  const [data, setData] = useState();

  useEffect(() => {
    setFileData(fileData);
    setSelectedData(selectedData);

    if (_fileData.length > 1 && _selectedData.length > 1) {
      let marks = selectedData.map((el) => {
        return { time: el["time"], ml_signal: el["ml_signal"] };
      });

      console.log("fileData");
      console.log(_fileData);
      console.log("selectedData");
      console.log(_selectedData);

      setData(combineArrayObjects(_fileData, marks));
    }
  }, [fileData, selectedData]);

  if (data) {
    return (
      <div className="div--save-data">
        <CSVDownloader
          type={Type.Button}
          filename={"test_2"}
          bom={true}
          config={{ delimiter: "," }}
          data={data}
        >
          Download file
        </CSVDownloader>
      </div>
    );
  } else {
    <div className="div--save-data"></div>;
  }
}
export default SaveFile;
