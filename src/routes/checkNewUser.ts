import bodyParser from 'body-parser';
import express from 'express';
import { Request, Response } from 'express';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { setRoleOnUser } from '../utils/userUtils';
import { checkUserIsAdmin, checkUserIsPlayer } from '../Services/userService';
import { Roles } from '../types';
import { verifyIdToken } from '../utils/authUtils';
const router = express.Router()


router.post('/', async (req: Request, res: Response) => {

    // Get the idtoken from the authorization header
    const idtoken = req.get('Authorization');
    if (!idtoken) {
        res.status(400).send('No idtoken provided under Authorization header');
        return;
    }
    
    // Verify the idtoken
    const claims = await verifyIdToken(idtoken)
    if (!claims) {
        res.status(400).send('Error while verifying idtoken');
        return;
    }

    console.log('Checking roles for user: ' + claims.email);

    // Check if user has an email and is logged in with microsoft
    if (!claims.email || !(claims.firebase.sign_in_provider == 'microsoft.com')) {
        console.log('User has no email or is not logged in with microsoft, setting role to guest...');
        await setRoleOnUser(Roles.guest, claims.sub);
        res.status(200).send({'shouldRefreshToken': true});
        return;
    }

    // Check if user is an admin
    if (await checkUserIsAdmin(claims.email)) {
        console.log('User is an admin, setting role to admin');
        await setRoleOnUser(Roles.admin, claims.sub);
        res.status(200).send({ 'shouldRefreshToken': true });
        return;
    }

    // Check if user is a player
    if (await checkUserIsPlayer(claims.email)) {
        console.log('User is a player, setting role to player');
        await setRoleOnUser(Roles.player, claims.sub);
        res.status(200).send({'shouldRefreshToken': true});
        return;
    }

    // If user is not a player, set role to guest
    setRoleOnUser(Roles.guest, claims.sub);
    console.log('User is not a player or admin, setting role to guest');
    res.status(200).send({'shouldRefreshToken': true});
});

export default router;

