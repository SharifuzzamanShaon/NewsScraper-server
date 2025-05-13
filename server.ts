const app = require("./app");
const bodyParser = require("body-parser");
const { connectDB } = require("./DB/ConnectDB");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
import express from "express";
const cookieParser = require("cookie-parser");
import { Request, Response, NextFunction } from 'express';

require("dotenv").config();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',') : [], // This should match the address of your frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable this if you need to handle cookies
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req:Request, res:Response) => {
  res.status(200).json({ message: "welcome" });
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));

app.use(express.static(path.join(__dirname, "public")));

interface CustomError extends Error {
    status?: number;
    message: string;
}
app.use((error:CustomError, req:Request, res:Response, next:NextFunction) => {
  const message = error.message ? error.message : "Server Error Occured";
  const status = error.status ? error.status : 500;
  res.status(status).json({ success: false, message });
});

const port =process.env.SERVER_PORT || 5008;
app.listen(port, async () => {
  console.log(`server Running at http://localhost:${port}`);
  await connectDB();
});