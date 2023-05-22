import bodyParser from 'body-parser';
import express from 'express';
import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { setRoleOnUser } from '../utils/userUtils';
import { checkUserIsPlayer } from '../Services/userService';
import { Roles } from '../types';
const router = express.Router()


router.post('/', bodyParser.json(), async (req: Request, res: Response) => {
    const idtoken: string = req.body.idtoken;
    const claims = await getAuth().verifyIdToken(idtoken);
    console.log('Handling new user: ' + claims.email);
    if (typeof claims.email === 'undefined') {
        console.log('Signed up user has no email address');
        return res.status(400).send('New user has no email address');
    }
    if (claims.firebase.sign_in_provider !== 'microsoft.com') {
        console.log('Signed up user is not a Microsoft user');
        return res.status(400).send('New user is not a Microsoft user');
    }
    if (await checkUserIsPlayer(claims.email)) {
        console.log('Signed up user is a player, updating claims...');
        setRoleOnUser({name: Roles.player, value: true}, claims);
        console.log('Claims updated');
        return res.status(200).send({'shouldRefreshToken': true});
    }
    setRoleOnUser({ name: Roles.guest, value: true }, claims);
    console.log('Signed up user is not a player');
    res.status(200).send({'shouldRefreshToken': false});
});

export default router;

