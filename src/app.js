import express from "express";
import router from "../Routes/Router.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

//Rotas
app.use('/', router);

export default app ;