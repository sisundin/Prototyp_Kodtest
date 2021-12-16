import React from "react";
import { useDropzone } from "react-dropzone"

function UploadBox(){
    const [files, setFiles] = React.useState([]);
    const [metaData, setMetadata] = React.useState({});
    const [uploading, setUploading] = React.useState(false);


    const { getRootProps, getInputProps } = useDropzone({
        maxFiles:1,
        accept: '.jpg, .pdf, .xml',
        onDrop: (acceptedFiles) => {
            setFiles(
            acceptedFiles.map((file) =>
                Object.assign(file, {
                 preview: URL.createObjectURL(file),
             })
             )
            )
      },
    });

    //Styles
    const text = {
        "color": "black",
        "lineHeight": "normal",
        
    };

    const sitemake ={
        "padding":"20px",
        "position": "absolute",
        "bottom": "10px",
        "right": "10px",
    }

    const dropSpace = {
        "backgroundColor":"white",
        "borderRadius": "32px",
        "padding": "32px 32px",
        "minHeight": "100px",
        "width": "300px",
        "display": "inline-block",
        "verticalAlign": "middle",
        "borderColor": "rgb(32, 32, 32)",
        "borderStyle":"solid",
        "boxShadow": "rgba(0, 0, 0, 0.8) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 0px 8px 0px"
    }


    //API connection for upload
    const uploadFiles = () => {
        const imageData = files[0];
        const metadata = {...metaData}
              
        let Form = new FormData();
        Form.append("files", imageData);
        Form.append("creatorname", metadata.name);
        Form.append("description", metadata.description);

        const requestOptions = {
            method: 'POST',
            body: Form , 
        };

        fetch("/uploadFiles", requestOptions)
        .then((res) => res.json())
        .then((data) => {setFiles([]); setMetadata({}); setUploading(false)  })
        .catch((e)=>console.log(e));
    }

    

    //Visual Components
    const Previews = () => files.map((file) => <div key={file.name}>
              <div>
                <p style={text}>Filename: {file.name}</p>
                <img src={file.preview} style={{ width: "200px" }} alt="preview" />
              </div>
            </div>);
            
          
    const uploader = () => {
        return <div>
            <p>
                Your Name: <input type="text" name="name" onChange={e => setMetadata({...metaData, name:e.target.value})}/>
            </p>
            <p>
                Description: <input type="text" name="description" onChange={e => setMetadata({...metaData, description:e.target.value})} />
            </p>
            {<button disabled={!metaData.name? true: !metaData.description? true: uploading? true: false} onClick={() => {setUploading(true); uploadFiles();}}>
                {!metaData.name? "Add your name": !metaData.description? "You need a discription":uploading? "Uploading...": "Upload"}
                </button>}
        </div>;}


    return (<div style={sitemake}>
                <div style = {dropSpace}>
                    <div  {...getRootProps()}>
                        <input {...getInputProps()} />
                        {!files.length? <span style={text}>Drag and drop file here to upload...</span> : Previews() }
                    </div>
                    {!files.length? null : uploader()}
                </div>
            </div>);
}

export default UploadBox