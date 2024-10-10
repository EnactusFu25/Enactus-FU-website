import { connection } from "./DB/models/connection.js";
import { config } from "dotenv"


config({path: "./config/dev.env"})
connection()