import express from "express";
import ComandosRouter from "./ComandosRouter.js";
import AdministratorRouter from "./AdministratorRouter.js";

const router = express.Router();

//rota default
router.get('/', (req, res) => {
    res.json({
        "statuscode": 200,
        "sucesso": "Rota default - RuralHub Bot"
    });
});

router.get('/teste', (req, res) => {
    res.json({
        "statuscode": 200,
        "sucesso": "Rota teste"
    });
});

router.use("/comandos", ComandosRouter)
router.use("/admin", AdministratorRouter)
export default router;