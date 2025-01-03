import express from "express";
import AdministratorController from "../src/Controller/AdministratorController.js";

const AdministratorRouter = express.Router();
const administratorController = new AdministratorController();

AdministratorRouter.post("/update", administratorController.updateComandos);


export default AdministratorRouter;