import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.send("Bem-vindo a lanchonete da creusa!!!");
});

module.exports = router;
