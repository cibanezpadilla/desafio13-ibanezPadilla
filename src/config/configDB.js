import mongoose from "mongoose";
import config from "./config.js"
import {logger} from "../utils/logger.js"
const URI = config.mongo_uri



/* const URI = 
    "mongodb+srv://cibanez:JUiXF4gBSbSulLkt@cluster0.21urnbo.mongodb.net/ecommerce?retryWrites=true&w=majority"; */

mongoose
  .connect(URI)
  .then(() => logger.info("Conectado a la DB"))
  .catch((error) => logger.error(error));