import express from "express";
import isAlive from './isAlive';
import checkNewUser from './checkUserRoles';
import getUserClaims from './getUserClaims';
import exchangeCustomToken from './exchangeCustomToken';
import generateIdToken from './generateIdToken';
import defaultRoute from './defaultRoute';

const router = express.Router();

router.use('/is-alive', isAlive);
router.use('/check-new-user', checkNewUser);
router.use('/get-user-claims', getUserClaims);
router.use('/exchange-custom-token', exchangeCustomToken);
router.use('/generate-id-token', generateIdToken);
router.use('/', defaultRoute);

export default router;