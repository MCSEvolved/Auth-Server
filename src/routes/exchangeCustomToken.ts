import express from "express";
import { getAuth } from "firebase/auth";
import { signInWithCustomToken } from "firebase/auth";
import { verifyIdToken } from "../utils/authUtils";
import { setRoleOnUser } from "../utils/userUtils";
import { Roles } from "../types";

// THIS FILE DOES NOT USE THE ADMIN SDK BUT THE CLIENT SDK

const router = express.Router();

router.get('/', async (req, res) => {
    const customToken = req.get('custom-token')
    if (!customToken) {
        res.status(400).send('No custom token provided in header, specify as custom-token')
        return
    }

    //verify custom token
    const auth = getAuth();
    const { user } = await signInWithCustomToken(auth, customToken);

    //set role
    await setRoleOnUser(Roles.service, user.uid);

    //get new token with role
    let idToken = await user.getIdToken(true);

    res.status(200).send({ "idToken": idToken, "refreshToken": user.refreshToken });
});

export default router;