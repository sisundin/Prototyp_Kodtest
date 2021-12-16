# Prototyp_Kodtest
 **My submission code**

I used React to create my frontend and node.js to create the backend. I stardet out with a npm create-react-app for the frontend. 

**To get this app started you need 2 terminals. One for server and one for the frontend**

**Step 1:** change directory ./server in one terminal and ./file-manager in the other

**Step2:** run npm install in booth terminals to get the dependancys needed to run

**Step3:** run npm start in booth terminals 

You are good to go! :) 

The server file can be found at: **./Prototyp_Kodtest/backend/server/index.js**

Frontend files can be found by starting at: **./Prototyp_Kodtest/file-manager/src/App.js**



**Some thoughts while creating the solution:**

To create the server I used "express". To allow file transfers to the server I used "express-fileupload". 
As a disclaimer to my solution, I want to raise the fact that I have never uploaded large files to a server before this so, I made the best effort I could within the timeframe presented. 
I, therefore, tried to make the solution as flexible as possible to leave the possibility to try another service. 
That's why I made the server. Then I could control the output from the API calls. 

For storage, I used two "firebase-admin" services. Cloud Firestore and Storage. Cloud Firestore does not support file uploads and to keep the size for the UI infomration down. I used Storage for keeping the files. 
The reason behind the choice to use firebase-admin where the flexibility in API responses makes it easier to reference to other storage methods. 


**Server side:**

I have not worked with file transfers before, therefore, wanted to create a server to handle the management of database contacts. 
I also wanted to create two databases. One optimized for larger files and one for creating the interface. 
Since I might be loading a lot of content I did not want to download the big files while in the UI.
This would take a long time and I would probably not use the files downloaded. 


**Frontend side**

The frontend is really basic. 3 server functions handle all of the operations. 

In the component "uploadComponent.js", I simply upload the file to the server after the user has added some metadata. 
I used a library called "react-dropzone" to manage the selections in the files which also made it possible to drag and drop a file to upload. 
Having a button to activate the action feels antiquated and clunky. 

In the component "displayComponent.js" I make 2 server operations. Download and delete files. 
I don't use any libraries here. I was going to try to implement a prettier and more dynamic design using Tailwind CSS. 
But since I am running out on my 4 hours I decided to only use some simple bootstrap table CSS.




