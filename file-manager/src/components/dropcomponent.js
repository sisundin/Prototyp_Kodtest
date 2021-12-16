import React from "react";
import { useDropzone } from "react-dropzone"

function UploadBox(){
    const [files, setFiles] = React.useState([]);
    const [metaData, setMetadata] = React.useState({});

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles:1,
        accept: 'image/jpeg, .pdf, .xml',
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

    React.useEffect(() => {
        console.log(files);
    }, [files]);


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
        .then((data) => {setFiles([]); setMetadata({}); })
        .catch((e)=>console.log(e));
    }


    const text = {
        "color": "Black",
    };

    const sitemake ={
        "padding":"20px",
        "position": "absolute",
        "bottom": "10px",
        "right": "10px",
    }

    const dropSpace = {
        "borderRadius": "32px",
        "padding": "8px 32px",
        "marginBottom":"10px",
        "minHeight": "50px",
        "width":"300px",
        "borderColor": "rgb(32, 32, 32)",
        "borderStyle":"solid",
        "color":"white",
        "boxShadow": "rgba(0, 0, 0, 0.8) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 0px 8px 0px"
    }

    const inputFeald = {
        "borderRadius": "32px",
        "padding": "8px 32px",
        "marginBottom":"20px",
        "minHeight": "60px",
        "width":"300px",
        "borderColor": "rgb(32, 32, 32)",
        "borderStyle":"solid",
        "color":"black",
        "boxShadow": "rgba(0, 0, 0, 0.8) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 0px 8px 0px"
    }

    const uploadbutton = {
        "borderRadius": "32px",
        "padding": "8px 32px",
        "minHeight": "60px",
        "backgroundColor": "rgb(89, 48, 229)",
        "borderColor": "rgb(32, 32, 32)",
        "borderStyle":"solid",
        "color":"white",
        "boxShadow": "rgba(0, 0, 0, 0.8) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 0px 8px 0px"
    }

    const Previews = () => files.map((file) => <div key={file.name}>
              <div>
                <p style={text}>{file.name}</p>
                <img src={file.preview} style={{ width: "200px" }} alt="preview" />
              </div>
            </div>);
            
          
    const uloader = () => <div style={inputFeald}>
            <p>
                Your Name: <input type="text" name="name" onChange={e => setMetadata({...metaData, name:e.target.value})}/>
            </p>
            <p>
                Description: <input type="text" name="description" onChange={e => setMetadata({...metaData, description:e.target.value})} />
            </p>
            {!metaData.name? "Add your name!": !metaData.description? "You need a discription!": <button onClick={() => uploadFiles()} style = {uploadbutton}>Upload</button>}
        </div>;


    return (<div style={sitemake}>
       
            <div style = {dropSpace} {...getRootProps()}>
            <input {...getInputProps()} />
            {!files.length? <p style={text}>Drag and drop file to upload...</p> : Previews() }
            </div>

            {!files.length? null : uloader()}
    
      </div>
  );


}

export default UploadBox