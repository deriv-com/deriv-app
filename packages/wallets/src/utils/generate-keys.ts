import crc32 from 'crc-32';

export default function generateKey(inputString: string) {
    // CRC32 to generate translation keys which generates keys faster than SHA256 and detect string changes
    return crc32.str(inputString);
}
