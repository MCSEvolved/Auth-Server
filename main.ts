import './env';
import express from 'express';
import { initializeApp as initializeAdminApp } from 'firebase-admin/app';
import endpoints from './src/routes/endpoints';
import cors from 'cors';
import { connectToDB } from './src/database';
import { initializeApp } from 'firebase/app';
import { credential } from 'firebase-admin';


const app = express();

//  Get firebase admin credentials
const FIREBASE_CREDENTIALS_PATH = process.env.FIREBASE_CREDENTIALS_PATH
if (!FIREBASE_CREDENTIALS_PATH) throw new Error('No FIREBASE_CREDENTIALS_PATH provided');
const cred = credential.cert(FIREBASE_CREDENTIALS_PATH)

// Initialize the firebase admin app
initializeAdminApp({
    credential: cred,
});

// Initialize the default firebase app
const firebaseConfig = {
    apiKey: "AIzaSyBlfZjJyhjcgyPfxaqkZHSR5SciFBWC5IY",
    authDomain: "mcsynergy-55878.firebaseapp.com",
    projectId: "mcsynergy-55878",
    storageBucket: "mcsynergy-55878.appspot.com",
    messagingSenderId: "822930182678",
    appId: "1:822930182678:web:35cfb548b7959056cb9b37",
    measurementId: "G-S8L1PJYE4K"
};

initializeApp(firebaseConfig);

const main = async () => {
    // Trust the proxy (Nginx)
    app.set('trust proxy', true);

    // Enable CORS
    app.use(cors())

    // Connect to the database
    await connectToDB().catch((err) => {  
        console.log("Could not connect to database");
        console.log(err);
        process.exit(1);
    });

    // Start the server
    app.listen(process.env.PORT ?? 3000, () => {
        console.log('Server is running on port: ' + process.env.PORT ?? 3000);
    });
    
    // Path the service is running on
    const PATH: string = process.env.API_PATH ?? '';
    console.log('Running on path: ' + PATH)

    // Add all endpoints to the server
    app.use(PATH, endpoints)
}

main()
