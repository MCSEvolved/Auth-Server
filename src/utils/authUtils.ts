import { DecodedIdToken, getAuth } from "firebase-admin/auth";

export async function verifyIdToken(idtoken: string) {
    let claims: DecodedIdToken;
    try {
        claims = await getAuth().verifyIdToken(idtoken);
    } catch (err: Error | any) {
        console.log('Error while verifying idtoken');
        console.log(err?.message);
        return null;
    }
    return claims;
}

export async function createCustomToken(uid: string) {
    let customToken: string;
    try {
        customToken = await getAuth().createCustomToken(uid);
    } catch (err: Error | any) {
        console.log('Error while creating custom token');
        console.log(err?.message);
        return null;
    }
    return customToken;
}