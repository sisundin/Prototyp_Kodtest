import React from "react";
import jpg from "../assets/jpg.png";
import pdf from "../assets/pdf.png";
import xml from "../assets/xml.png";


function FilesShower(){
    const [files, setFiles] = React.useState([]);
    const [serverIsLive , setServerStatus] = React.useState(false);
    const [update, setupdate] = React.useState(0);
    

    React.useEffect(() => {
        
        if (serverIsLive) {
            getdata();
        }
        else{
            checkServerStatus();
        }
        
    }, [serverIsLive, update]);

    const checkServerStatus =  () => {
        fetch("/status").then((res) => res.json())
        .then((data) => setServerStatus(data.isLive?true: false));
    }

    const getdata = () => {
        fetch("/getObjects").then((res) => res.json())
        .then((data) => {console.log(data.data); setFiles(data.data);});
    }

    const removefile = (id, fileid) => {
        fetch("/removeFile?id="+id +"&filsestorageID="+fileid).then((res) => res.json())
        .then((data) => {console.log(data.data); setupdate(update+1);});
    }

    const loadIllustrativeImage= (type)=>{
        
        const image = type === "text/xml"? xml: type === "application/pdf"?pdf: type === "image/jpeg"? jpg: null;
        return image?<img alt="Preview broken" height={"50px"} src={image} ></img>:<p>{type}</p>

    }

    const showFiles = () => {
       return <table className="table">
       <thead>
        <tr>
            <th scope="col">Type</th>
            <th scope="col">Filename</th>
            <th scope="col">Description</th>
            <th scope="col">Uploaded by</th>
            <th scope="col">Date</th>
        </tr>
        </thead>
        <tbody>{files.map(file => {
                return (
                <tr id={file.id}>
                    <td>{loadIllustrativeImage(file.type)}</td>
                    <td ><a href={file.link}>{file.filename}</a></td>
                    <td>{file.description}</td>
                    <td>{file.uploadername}</td>
                    <td>{file.date}</td>
                    <td onClick={()=>removefile(file.id, file.filsestorageID)}>X</td>
                </tr>)
                })}
       </tbody>
       </table>
    }

    const noFilesFound = () => {
        return <><p>No files found</p>
                <button onClick={() => setupdate(update+1)}>Refresh</button></>
    }

    const sitemake ={
        
        "width": "600px",
        "textAlign":"left"
    }

    return (<center>
        <div style={sitemake}>
            {!serverIsLive?"Server is offline" :!files.length?noFilesFound():showFiles()}
        </div>
        </center>)


}

export default FilesShower