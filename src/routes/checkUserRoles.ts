import bodyParser from 'body-parser';
import express from 'express';
import { Request, Response } from 'express';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { setRoleOnUser } from '../utils/userUtils';
import { checkUserIsPlayer } from '../Services/userService';
import { Roles } from '../types';
import { verifyIdToken } from '../utils/authUtils';
const router = express.Router()


router.post('/', async (req: Request, res: Response) => {

    // Get the idtoken from the authorization header
    const idtoken = req.get('authorization');
    if (!idtoken) return res.status(400).send('No idtoken provided under authorization header');
    
    // Verify the idtoken
    const claims = await verifyIdToken(idtoken)
    if (!claims) return res.status(400).send('Error while verifying idtoken');

    console.log('Checking roles for user: ' + claims.email);

    // Check if user has a Microsoft account
    if (!claims.email) {
        console.log('User has no email address');
        return res.status(400).send('User has no email address');
    }

    // Check if user is a Microsoft user
    if (claims.firebase.sign_in_provider !== 'microsoft.com') {
        console.log('User is not a Microsoft user');
        return res.status(400).send('User is not a Microsoft user');
    }

    // Check if user is a player
    if (await checkUserIsPlayer(claims.email)) {
        console.log('User is a player, updating claims...');
        await setRoleOnUser(Roles.player, claims.sub);
        return res.status(200).send({'shouldRefreshToken': true});
    }

    // TODO: Check if user is an admin
    // set admin role
    // return res.status(200).send({'shouldRefreshToken': true});

    // If user is not a player, set role to guest
    setRoleOnUser(Roles.guest, claims.sub);
    console.log('User is not a player or admin, setting role to guest');
    res.status(200).send({'shouldRefreshToken': false});
});

export default router;

