import { config } from "dotenv"
import { initiate_app } from "./src/initiate-app.js";
import express from "express";
config({path: "./config/dev.env"})


const app = express()
initiate_app(app, express)