import express from "express";
import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    // Get the idtoken from the authorization header
    const idtoken = req.get('Authorization');
    if (!idtoken) return res.status(400).send('No idtoken provided under authorization header');

    // Verify the idtoken
    let claims;
    try {
        claims = await getAuth().verifyIdToken(idtoken);
    } catch (error: any) {
        if (error.code === 'auth/id-token-expired') return res.status(400).send('Idtoken expired')
        console.log("Error while verifying idtoken: " + error.message)
    }
    if (!claims) return res.status(400).send('Error while verifying idtoken');

    // Send the claims back to the client
    console.log('Sending claims of user: ' + claims.email);
    res.status(200).send(claims);
});

export default router;