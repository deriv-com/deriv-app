export const getTokenList = () => {
    const tokenList = localStorage.getItem('tokenList');
    return JSON.parse(tokenList || '{}');
};

export const removeAllTokens = () => {
    localStorage.removeItem('tokenList');
};
