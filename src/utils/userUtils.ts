import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { Roles } from "../types";

export async function setRoleOnUser(role: {name: Roles, value: boolean}, currentClaims: DecodedIdToken) {

    let roleClaims = {
        [Roles.player]: currentClaims[Roles.player] || false,
        [Roles.admin]: currentClaims[Roles.admin] || false,
        [Roles.guest]: currentClaims[Roles.guest] || false,
    }

    // If role is guest, set all other roles to false
    if (role.name === Roles.guest && role.value === true) {
        roleClaims = {
            [Roles.player]: false,
            [Roles.admin]: false,
            [role.name]: role.value,
        };
    // If role is admin or player, set guest to false
    } else if ((role.name === Roles.player || role.name === Roles.admin) && role.value === true) {
        roleClaims.isGuest = false;
        roleClaims[role.name] = role.value;
    } else {
        roleClaims[role.name] = role.value;
    }
    await getAuth().setCustomUserClaims(
        currentClaims.sub,
        roleClaims
    );
    console.log('Claims updated');
}