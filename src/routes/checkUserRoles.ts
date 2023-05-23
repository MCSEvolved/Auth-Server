import bodyParser from 'body-parser';
import express from 'express';
import { Request, Response } from 'express';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { setRoleOnUser } from '../utils/userUtils';
import { checkUserIsPlayer } from '../Services/userService';
import { Roles } from '../types';
const router = express.Router()


router.post('/', bodyParser.json(), async (req: Request, res: Response) => {
    const idtoken: string = req.body.idtoken;
    let claims: DecodedIdToken;

    try {
        claims = await getAuth().verifyIdToken(idtoken);
    } catch(err: Error | any){
        console.log('Error while verifying idtoken');
        console.log(err?.message);
        return res.status(400).send('Error while verifying idtoken');
    }
    console.log('Checking roles for user: ' + claims.email);
    if (typeof claims.email === 'undefined') {
        console.log('User has no email address');
        return res.status(400).send('User has no email address');
    }
    if (claims.firebase.sign_in_provider !== 'microsoft.com') {
        console.log('User is not a Microsoft user');
        return res.status(400).send('User is not a Microsoft user');
    }
    if (await checkUserIsPlayer(claims.email)) {
        console.log('User is a player, updating claims...');
        await setRoleOnUser({name: Roles.player, value: true}, claims);
        return res.status(200).send({'shouldRefreshToken': true});
    }
    setRoleOnUser({ name: Roles.guest, value: true }, claims);
    console.log('User is not a player');
    res.status(200).send({'shouldRefreshToken': false});
});

export default router;

