import { useRef, useState } from "react";
import { readString, readRemoteFile, usePapaParse } from "react-papaparse";
import Papa from "papaparse";
import { config } from "process";

/*Compont Info:
 *A input component that gets the user csv the data is converted
 *to a array of objects and stored to the pareent useState.*/

interface Props {
  setFileData: React.Dispatch<React.SetStateAction<Array<Array<string>>>>;
  setFileColumns: React.Dispatch<React.SetStateAction<Array<string>>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

function ImportUserFile({ setFileData, setFileColumns, setMessage }: Props) {
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  function getCsv(file: File) {
    setMessage("Loading in file...");
    let data: Array<Array<string>> = [];

    //This is the function that reads the csv file
    //Ignore the warning about the type of the results
    readRemoteFile(file, {
      header: true,
      skipEmptyLines: true,
      chunkSize: 3000000,
      worker: true,

      chunk: function (results: Papa.ParseResult<Array<string>>) {
        data.push(...results.data);

        setMessage(
          `Loading file\n${(results.meta.cursor / 1000000).toFixed(1)}/${(
            file.size / 1000000
          ).toFixed(1)} MB`
        );

        if (file.size === results.meta.cursor) {
          setFileData(data);
          setFileColumns(results.meta.fields);
          setMessage("File has been uploaded.");
        }
      },
    });
  }

  return (
    <div>
      <input
        onChange={(e) => {
          if (e.target.files && inputFileRef.current) {
            e.preventDefault();
            let fileSize: number = +e.target.files[0].size;
            console.log(fileSize);
            //checks if the file is not larger the 300 megabytes

            getCsv(e.target?.files[0]);
          }
        }}
        ref={inputFileRef}
        type="file"
        id="dataset_file"
        accept=".csv"
      />
    </div>
  );
}

export default ImportUserFile;
