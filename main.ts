import './env';
import express from 'express';
import isAlive from './src/routes/isAlive';
import checkNewUser from './src/routes/checkUserRoles';
import getUserClaims from './src/routes/getUserClaims';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import cors from 'cors';
import { connectToDB } from './src/database';


const app = express();
initializeApp({
    credential: applicationDefault()
});

app.use(cors({
    origin: ['https://mcsynergy.nl', 'http://localhost:5173', 'http://localhost:5174']
}))

const main = async () => {
    await connectToDB().catch((err) => {  
        console.log("Could not connect to database");
        console.log(err);
        process.exit(1);
    });

    app.listen(process.env.PORT ?? 3000, () => {
        console.log('Server is running on port: ' + process.env.PORT ?? 3000);
    });


    app.use('/api/auth/is-alive', isAlive)
    app.use('/api/auth/check-user-roles', checkNewUser)
    app.use('/api/auth/get-user-claims', getUserClaims)
}

main()
