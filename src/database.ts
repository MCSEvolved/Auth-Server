import { MongoClient } from 'mongodb';

let cachedDB: any = null;

export async function connectToDB() {
    const uri = process.env.MONGO_URI ?? '';
    const client = new MongoClient(uri, );
    console.log("Connecting to database...")
    const connection = await client.connect();
    console.log('Connected to database')
    connection.addListener('close', () => {
        cachedDB = null;
    });
    cachedDB = connection.db("users");
}

export function getDB() {
    return cachedDB;
}

export function checkIfCollectionExists(collName: string) {
    return cachedDB.listCollections({ name: collName }).hasNext();
}