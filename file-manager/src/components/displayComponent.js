import React from "react";
import jpg from "../assets/jpg.png";
import pdf from "../assets/pdf.png";
import xml from "../assets/xml.png";


function FilesShower(){
    const [files, setFiles] = React.useState([]);
    const [update, setupdate] = React.useState(0);
    

    React.useEffect(() => {
            getdata();
    }, [update]);

    //Styles
    const sitemake ={
        "width": "700px",
        "textAlign":"left"
    }


    //API connection
    const getdata = () => {
        fetch("/getObjects").then((res) => res.json())
        .then((data) => { setFiles(data.data);});
    }


    const removefile = (id, fileid) => {
        fetch("/removeFile?id="+id +"&filsestorageID="+fileid).then((res) => res.json())
        .then((data) => { setupdate(update+1);});
    }


    //Component rendering
    const loadIllustrativeImage= (type) => {
        const image = type === "text/xml"? xml: type === "application/pdf"?pdf: type === "image/jpeg"? jpg: null;
        return image?<img alt="Preview broken" height={"50px"} src={image} ></img>:<p>{type}</p>
    }


    const sortFilesname = (direction="down") => {
        if (direction === "up"){
            setFiles(files.sort((a, b) => (a.filename > b.filename) - (a.filename < b.filename) ));
        }else if (direction === "down"){
            setFiles(files.sort((a, b) => (a.filename < b.filename) - (a.filename > b.filename) ));
        }
    }

    // The component that renders the files avalable on the database
    const showFiles = () => {
       return <><table className="table">
       <thead>
        <tr>
            <th scope="col">Type</th>
            <th scope="col" onClick={() => { sortFilesname("down");}}>Filename</th>
            <th scope="col">Description</th>
            <th scope="col">Uploaded by</th>
            <th scope="col">Date</th>
        </tr>
        </thead>
        <tbody>{files.map(file => {
                return (<tr key={file.id}>
                    <td>{loadIllustrativeImage(file.type)}</td>
                    <td><a href={file.link}>{file.filename}</a></td>
                    <td>{file.description}</td>
                    <td>{file.uploadername}</td>
                    <td>{file.date}</td>
                    <td onClick={()=>removefile(file.id, file.filsestorageID)}>X</td>
                </tr>)
                })}
       </tbody>
       </table>
       <button onClick={() => setupdate(update+1)}>Refresh</button>
       </>
    }


    const noFilesFound = () => {
        return <>
                <p>No files found</p>
                <button onClick={() => setupdate(update+1)}>Refresh</button>
            </>
    }
    

    return (<center>
            <div style={sitemake}>
                {!files.length?noFilesFound():showFiles()}
            </div>
        </center>)


}

export default FilesShower