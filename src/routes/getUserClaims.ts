import express from "express";
import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

const router = express.Router();

router.get('/:idtoken', async (req: Request, res: Response) => {
    const idtoken: string = req.params.idtoken;
    const claims = await getAuth().verifyIdToken(idtoken);
    console.log('Sending claims of user: ' + claims.email);
    res.status(200).send(claims);
});

export default router;