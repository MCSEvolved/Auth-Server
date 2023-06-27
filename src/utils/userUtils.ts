import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { Roles } from "../types";

export async function setRoleOnUser(role: Roles, userUID: string) {
    if (typeof userUID === 'undefined') {
        console.log('User has no uid');
        return;
    }

    if (typeof role === 'undefined') {
        console.log('Role is undefined');
        return;
    }

    let roleClaims = {
        role
    }

    await getAuth().setCustomUserClaims(
        userUID,
        roleClaims
    );
    console.log('Claims updated');
}