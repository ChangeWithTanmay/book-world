import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

app.use(cookieParser())

// routes import
import patientRouter from "./routes/patient.route.js";
import userRouter from './routes/user.route.js'
import bookRouter from './routes/book.route.js'


// routes Declaration
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/book", bookRouter);

export { app }