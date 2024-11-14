import { connection } from "./DB/models/connection.js";
import { config } from "dotenv"
import { initiate_app } from "./src/initiate-app.js";

config({path: "./config/dev.env"})


const app = express()
initiate_app(app, express)