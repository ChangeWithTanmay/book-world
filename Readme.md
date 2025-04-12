# Build A Doctor Appintment System
Our Project Model 
- [Model link](https://app.eraser.io/workspace/9pVLeH7ZrRTysFvGVVBr?origin=share)

## Setup project
- ### Step 1: Initialize Node Package Manager ```npm init```

- ### Step 2: Add ReadMe.md File ```Readme.md```

- ### Step 3: Git & Github Add 
```
git init
git add .
git commit -m "Add initial file for Backend devlopment"
git branch -M main"
git remote add origin https://github.com/ChangeWithTanmay/Doctor-Backend-Devlopmend.git"
git push -u origin main
```

- ### Step 4: Create Folder Stracture
```
|-public
|    |-temp
|       |-.gitkeep
|
|-.gitignore
|-.env
|-src
   |-app.js
   |-constants.js
   |-index.js 
```

- ### Step 5: Edit package.json ```package.json``` 
```javascript
"type": "module"
```

- ### Step 6: Install Nodemon
 Only install Devdendency. ```npm install --save-dev nodemon```

 - ### Step 7: Edit Package.json
 ```
"script":{
   "dev": "nodemon src/index.js"
}
 ```

 - ### Step 8: File Stracture
 ```
|- src
   |- controllers
   |- db
   |- middleware
   |- module
   |- routes
   |- utils
 ```

 - ### Step 9: Prettier 
 Only use perpus is structure file.

<b>Install Prettier (Dev) :</b> ```npm i -D prettier```

<b>Format file :</b>  ``` npx prettier --write```

   1.  Add ```.prettierignore``` file:
   2. Add ```.prettierrc``` file:

   - ### Step 10: MongoDB Connection
   - ### Step 11: .env File Add
   <ul>
      <ul>
         <li>PORT = 8050</li>
         <li>MONGOBD_URI = url</li>
      </ul>
   </ul>

   - ### Step 12: DataBase Name ```constants.js```
   ```
      export const DB_NAME = "DoctorAppointment"
   ```
   - ### Step 13: Install mongoose, Express, DotEnv Dependency
   ```npm i mongoose express dotenv```
   - ### Step 14: Separately DB connection
   ``` index.js File Add```
   ``` 
   |- db
   |  |- index.js
   |- middleware
   |- models
   |- routes
   ```
```javascript
   import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED", error);
    process.exit(1);
  }
};


export default connectDB

```

   - ### Step 15: DotENV import and Setup
   <ul>
   <ul>
      <li>Import :</li>
   </ul>
   </ul>
   
   ```javascript
   import dotenv from "dotenv";

    dotenv.config({
         path: './env'
      })
   ```
   
<ul>
   <ul>
      <li>Setup :</li>
   </ul>
   </ul>

```package.json ```
   ```javascript
   "scripts": {
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
  },
   ```

   - ### Step 16: 