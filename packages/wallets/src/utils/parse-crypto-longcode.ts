const parseCryptoLongcode = (longcode: string) => {
    const splitLongcode = longcode.split(/,\s/);
    const addressHashMatch = /:\s([0-9a-zA-Z]+.{25,28})/gm.exec(splitLongcode[0]);
    const addressHash = addressHashMatch?.[1];
    const blockchainHashMatch = /:\s([0-9a-zA-Z]+.{25,34})/gm.exec(splitLongcode[1]);
    const blockchainHash = blockchainHashMatch?.[1];

    return { addressHash, blockchainHash, splitLongcode };
};

export default parseCryptoLongcode;
