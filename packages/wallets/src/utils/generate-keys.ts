import { sha256 as SHA256 } from 'sha.js';

export default function generateKey(inputString: string) {
    // Convert the string to an array buffer
    const key = new SHA256().update(inputString).digest('hex');

    // NOTE: If there are key collisions, increase the substring length
    return key.substring(0, 8);
}
