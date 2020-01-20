export const getTokenList = () => {
    const tokenList =  localStorage.getItem('tokenList') ;
    return JSON.parse(tokenList || '{}');
};

export const setTokenList = (tokenList = []) => {
    localStorage.setItem('tokenList' , JSON.stringify(tokenList));
};

const findAccount = (accountName = '') =>
    getTokenList().findIndex(tokenInfo => tokenInfo.accountName === accountName);

export const findToken = (token = '') =>
    getTokenList().findIndex(tokenInfo => tokenInfo.token === token);

export const addToken = (token = '', loginInfo, hasRealityCheck = false, hasTradeLimitation = false) => {
    const { loginid: accountName } = loginInfo;
    const tokenList = getTokenList();
    const tokenIndex = findToken(token);
    const accountIndex = findAccount(accountName);
    if (tokenIndex < 0 && accountIndex < 0) {
        tokenList.push({
            accountName,
            token,
            loginInfo,
            hasRealityCheck,
            hasTradeLimitation,
        });
        setTokenList(tokenList);
    }
};

export const getToken = token => {
    const tokenList = getTokenList();
    const index = findToken(token);
    return index >= 0 ? tokenList[index] : {};
};

export const removeToken = token => {
    const index = findToken(token);
    if (index > -1) {
        const tokenList = getTokenList();
        tokenList.splice(index, 1);
        localStorage.setItem('tokenList' , JSON.stringify(tokenList));
    }
};

export const removeAllTokens = () => {
    localStorage.removeItem('tokenList');
};

export const isLoggedIn = () => {
    const tokens = getTokenList();
    return Object.keys(tokens).length > 0;
};
