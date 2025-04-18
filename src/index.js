import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8050, () => {
      console.log(`\n\n⚙️  Server is running at port : ${process.env.PORT} ✅`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB Connection Faild !!!", err);
  });
