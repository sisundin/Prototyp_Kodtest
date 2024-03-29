import {useEffect, useState} from "react";
import jpg from "../assets/jpg.png";
import pdf from "../assets/pdf.png";
import xml from "../assets/xml.png";

function FilesShower(props) {
  const [parentUpdate, setParetnUpdate] = useState(0);
  const [files, setFiles] = useState([]);
  const [update, setupdate] = useState(0);
  const [filnameSortDirection, changeFilnameSortDirection] = useState(
    "up"
  );
  const [dateSortDirection, changeDateSortDirection] = useState("up");

  if (props.didUpdate !== parentUpdate) {
    setParetnUpdate(props.didUpdate);
  }

  useEffect(() => {
    getdata();
  }, [update, parentUpdate]);

  //Styles
  const sitemake = {
    width: "700px",
    textAlign: "left",
  };

  //API connection
  const getdata = () => {
    fetch("http://localhost:3001/getObjects")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.data);
      });
  };

  const removefile = (id, fileid) => {
    fetch(
      "http://localhost:3001/removeFile?id=" + id + "&filsestorageID=" + fileid
    )
      .then((res) => res.json())
      .then((data) => {
        setupdate(update + 1);
      });
  };

  //Component rendering
  const loadIllustrativeImage = (type) => {
    //Avaliable formats
    const typeManager = {
      "text/xml": xml,
      "application/pdf": pdf,
      "image/jpeg": jpg,
    };

    const image = typeManager[type];

    return image ? (
      <img alt="Preview broken" height={"50px"} src={image}></img>
    ) : (
      <p>{type}</p>
    );
  };

  const sortFilesname = () => {
    if (filnameSortDirection === "up") {
      setFiles([
        ...files.sort((a, b) => {
          return b.filename.localeCompare(a.filename);
        }),
      ]);
      changeFilnameSortDirection("down");
    } else if (filnameSortDirection === "down") {
      setFiles([
        ...files.sort((a, b) => {
          return a.filename.localeCompare(b.filename);
        }),
      ]);
      changeFilnameSortDirection("up");
    }
  };

  const sortCreationdate = () => {
    if (dateSortDirection === "up") {
      setFiles([
        ...files.sort((a, b) => {
          return b.date.localeCompare(a.date);
        }),
      ]);
      changeDateSortDirection("down");
    } else if (dateSortDirection === "down") {
      setFiles([
        ...files.sort((a, b) => {
          return a.date.localeCompare(b.date);
        }),
      ]);
      changeDateSortDirection("up");
    }
  };

  // The component that renders the files avalable on the database
  const showFiles = () => {
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col" onClick={sortFilesname}>
                Filename {filnameSortDirection === "up" ? "↑" : "↓"}
              </th>
              <th scope="col">Description</th>
              <th scope="col">Uploaded by</th>
              <th scope="col" onClick={sortCreationdate}>
                Date {dateSortDirection === "up" ? "↑" : "↓"}
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => {
              return (
                <tr key={file.id}>
                  <td>{loadIllustrativeImage(file.type)}</td>
                  <td>
                    <a href={file.link}>{file.filename}</a>
                  </td>
                  <td>{file.description}</td>
                  <td>{file.uploadername}</td>
                  <td>{file.date}</td>
                  <td onClick={() => removefile(file.id, file.filsestorageID)}>
                    X
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button onClick={() => setupdate(update + 1)}>Refresh</button>
      </>
    );
  };

  const noFilesFound = () => {
    return (
      <>
        <p>No files found</p>
        <button onClick={() => setupdate(update + 1)}>Refresh</button>
      </>
    );
  };

  return (
    <center>
      <div style={sitemake}>{!files.length ? noFilesFound() : showFiles()}</div>
    </center>
  );
}

export default FilesShower;
