"use strict";
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();
// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const serviceAccount = require("./clear-aurora-333717-a298bedcdfed.json");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

// Setup for cors
var whitelist = ["http://localhost:3000"]; //white list consumers
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "device-remember-token",
    "Access-Control-Allow-Origin",
    "Origin",
    "Accept",
  ],
};

app.use(cors(corsOptions)); //adding cors middleware to the express with above configurations

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.use(express.static(path.resolve(__dirname, "../file-manager/build")));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/status", (req, res) => {
  res.json({ message: "Server is doing great", isLive: true });
});

app.get("/removeFile", async (req, res) => {
  try {
    const id = req.query.id;
    const filsestorageID = req.query.filsestorageID;
    await getStorage()
      .bucket("gs://clear-aurora-333717.appspot.com/")
      .file(filsestorageID)
      .delete();
    const result = await db.collection("dataSaved").doc(id).delete();

    res.status(200).send({
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/getObjects", async (req, res) => {
  try {
    const database = await db.collection("dataSaved");
    const snapshot = await database.get();
    let response = [];

    snapshot.forEach((doc) => {
      response = [...response, { id: doc.id, ...doc.data() }];
    });

    res.status(200).send({
      data: response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.post("/uploadFiles", async (req, res) => {
  try {
    // Worth cheking that there accually is a file linked.
    if (!req.files) {
      console.log(req.files);
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Parase metadata
      let file = req.files.files;
      let metaData = req.body;

      //Metadata for file upload to storage
      const metadata = {
        contentType: file.mimetype,
        public: true,
      };

      // Uploading the file to a storage bucket
      const storagefile = await getStorage()
        .bucket("gs://clear-aurora-333717.appspot.com/")
        .upload(file.tempFilePath, metadata);

      // Getting some metadata from the storage bucket
      const link = storagefile[0].metadata.mediaLink;
      const filsestorageID = storagefile[0].metadata.name;

      // Just ceating a uploaddate
      const currentdate = new Date();
      const datetime =
        "" +
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " - " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

      // Extracting relevant infomration to create a storage datapack for a database
      const datapack = {
        date: datetime,
        filename: file.name,
        uploadername: metaData.creatorname ? metaData.creatorname : null,
        description: metaData.description ? metaData.description : null,
        type: file.mimetype,
        filepath: file.tempFilePath,
        link: link,
        filsestorageID: filsestorageID,
      };

      // Save the file information
      const database = await db.collection("dataSaved");
      const result = await database.add(datapack);

      //console.log('Added document with ID: ', result.id);

      //send response
      res.status(200).send({
        message: "added document with ID: " + result.id,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//app.get('*', (req, res) => {
// console.log("this was activated?")
//res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
//});
