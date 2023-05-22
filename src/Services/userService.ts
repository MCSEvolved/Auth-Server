import { getDB } from "../database";

export async function checkUserIsPlayer(_email: string): Promise<boolean> {
    const result = await getDB().collection('Players').findOne({email: _email});
    if (result) {
        return true;
    }
    return false;
}