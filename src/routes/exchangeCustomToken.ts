import express from "express";
import { User, getAuth } from "firebase/auth";
import { signInWithCustomToken } from "firebase/auth";
import { verifyIdToken } from "../utils/authUtils";
import { setRoleOnUser } from "../utils/userUtils";
import { Roles } from "../types";

// THIS FILE DOES NOT USE THE ADMIN SDK BUT THE CLIENT SDK

const router = express.Router();

router.post('/', async (req, res) => 
{
    console.log('Received exchange custom token request')
    //get custom token from header
    const customToken = req.get('custom-token')
    if (!customToken) {
        res.status(400).send('No custom token provided in header, specify as custom-token')
        console.log('No custom token provided in header, specify as custom-token')
        return
    }

    //verify custom token
    const auth = getAuth();
    let user: User;
    try {
        const userCredential = await signInWithCustomToken(auth, customToken);
        user = userCredential.user;
    } 
    catch (error) {
        res.status(400).send('Error while verifying custom token')
        console.log(error)
        return
    }

    console.log("custom token verified, setting isService role")
    //set service role
    await setRoleOnUser(Roles.service, user.uid);

    //get new token with role
    let idToken = await user.getIdToken(true);

    console.log("sending new token")
    res.status(200).send(idToken);
});

export default router;