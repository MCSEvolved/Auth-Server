import express from "express";
import isAlive from './isAlive';
import checkNewUser from './checkNewUser';
import getUserClaims from './getUserClaims';
import exchangeCustomToken from './exchangeCustomToken';
import defaultRoute from './defaultRoute';

const router = express.Router();

router.use('/is-alive', isAlive);
router.use('/check-new-user', checkNewUser);
router.use('/get-user-claims', getUserClaims);
router.use('/exchange-custom-token', exchangeCustomToken);
router.use('/', defaultRoute);

export default router;