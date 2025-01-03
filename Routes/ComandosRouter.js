import express from "express";
import ComandosController from "../src/Controller/ComandosController.js";

const ComandosRouter = express.Router();
const comandosController = new ComandosController();

ComandosRouter.get("/", comandosController.getAll.bind(comandosController));
ComandosRouter.get("/:name", comandosController.getName.bind(comandosController));
ComandosRouter.post("/", comandosController.addComandos.bind(comandosController));
ComandosRouter.put("/:id", comandosController.alterComandos.bind(comandosController));
ComandosRouter.delete("/:id", comandosController.deleteComandos.bind(comandosController));

export default ComandosRouter;