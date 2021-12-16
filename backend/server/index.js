'use strict';
const express = require("express");
const fileUpload = require('express-fileupload');
const path = require('path');



const PORT = process.env.PORT || 3001;


const app = express();
// enable files upload
app.use(fileUpload({
  createParentPath: true,
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

const serviceAccount = require('./clear-aurora-333717-a298bedcdfed.json');
const { initializeApp,  cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const { getStorage} = require('firebase-admin/storage');


initializeApp({
    credential: cert(serviceAccount),
  });


const db =  getFirestore();


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
  

app.use(express.static(path.resolve(__dirname, '../file-manager/build')));


app.get("/status", (req, res) => {
    res.json({ message: "Server is doing great", isLive:true });
  });


app.get("/removeFile", async (req, res) => {

  try{
  const id = req.query.id;
  const filsestorageID = req.query.filsestorageID
  await getStorage().bucket("gs://clear-aurora-333717.appspot.com/").file(filsestorageID).delete();
  const result = await db.collection('dataSaved').doc(id).delete();
  
  res.send({
    data:result
  });
  }catch (err) {
    console.log(err);
    res.status(500).send(err);
}
});



app.get("/getObjects", async (req, res) => {
  
  try{
  const database =  await db.collection('dataSaved');
  const stapshot = await database.get();
  let response = [];

  stapshot.forEach(doc => {
    response = [...response, {id:doc.id, ...doc.data()}]
  });

    res.send({
      data:response
    });
  }catch (err) {
    console.log(err);
    res.status(500).send(err);
}
});


app.post('/uploadFiles', async (req, res) => {
  try {
    
    // Worth cheking that there accually is a file linked. 
    if(!req.files) {
      console.log(req.files);
        res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {

      const database = await db.collection("dataSaved");

        let file = req.files.files;
        let metaData = req.body;

        const metadata = {
          contentType: file.mimetype,
          public: true,
        };

        // Uploading the file to a storage bucket
        const storagefile = await getStorage().bucket("gs://clear-aurora-333717.appspot.com/").upload(file.tempFilePath, metadata);
        
        // Getting some metadata from the storage bucket 
        const link = storagefile[0].metadata.mediaLink;
        const filsestorageID = storagefile[0].metadata.name;

        // Just ceating a uploaddate
        const currentdate = new Date(); 
        const datetime = "" + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " - "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
       
        // Extracting relevant infomration to create a storage datapack for a database
        const datapack = {
          date: datetime,
          filename: file.name,
          uploadername: metaData.creatorname?metaData.creatorname:null,
          description: metaData.description?metaData.description:null,
          type: file.mimetype,
          filepath: file.tempFilePath,
          link: link,
          filsestorageID: filsestorageID
          
        };

        const result = await database.add(datapack);

        await console.log('Added document with ID: ', result.id);

       
        //send response
        res.send({status: true, message: 'File is uploaded'});
    }
} catch (err) {
    console.log(err);
    res.status(500).send(err);
}

})




app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});






