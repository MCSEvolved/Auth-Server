import express from "express";

const router = express.Router();

router.get('/', async (req, res) => {
    console.log(req.ip);
    res.status(400).send('Not implemented yet')
});

export default router; 