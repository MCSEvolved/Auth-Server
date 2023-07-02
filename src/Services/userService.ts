import { checkIfCollectionExists, getDB } from "../database";

export async function checkUserIsPlayer(_email: string): Promise<boolean> {
    if (!checkIfCollectionExists('players')) throw new Error('Collection players does not exist');
    const result = getDB().collection('players').findOne({email: _email});
    if(!result) return false;
    return true;
}

export async function checkUserIsAdmin(_email: string): Promise<boolean> {
    if (!checkIfCollectionExists('admins')) throw new Error('Collection admins does not exist');
    const result = await getDB().collection('admins').findOne({email: _email});
    if(!result) return false;
    return true;
}