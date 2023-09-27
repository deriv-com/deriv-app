/**
 * Transform hash string to middle truncated hash string
 * @param hash {string}
 * @returns {string}
 */
const getTruncatedHashString = (hash: string) => {
    return `${hash.substring(0, 4)}....${hash.substring(hash.length - 4)}`;
};

export default getTruncatedHashString;
