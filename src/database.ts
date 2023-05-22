import { MongoClient } from 'mongodb';

let cachedDB: any = null;

export async function connectToDB() {
    const uri = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri);
    const connection = await client.connect();
    console.log('Connected to database')
    connection.addListener('close', () => {
        cachedDB = null;
    });
    cachedDB = connection.db('mcsynergy_dev');
}

export function getDB() {
    return cachedDB;
}