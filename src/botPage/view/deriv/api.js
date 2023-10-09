import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getLanguage, get as getStorage, getAppIdFallback } from '@storage';
import { getDomainAppId } from '@utils';

const isRealAccount = () => {
    const accountList = JSON.parse(getStorage('tokenList') || '{}');
    const activeToken = getStorage('activeToken') || [];
    let activeAccount = null;
    let isReal = false;
    try {
        activeAccount = accountList.filter(account => account.token === activeToken);
        isReal = !activeAccount[0].accountName.startsWith('VRT');
    } catch (e) {} // eslint-disable-line no-empty
    return isReal;
};

export const getCustomEndpoint = () => ({
    url: getStorage('config.server_url'),
    appId: getStorage('config.app_id'),
});

export const getDefaultEndpoint = () => ({
    url: isRealAccount() ? 'green.binaryws.com' : 'blue.binaryws.com',
    appId: getStorage('config.default_app_id') || getDomainAppId(),
});

export const getServerAddressFallback = () => getCustomEndpoint().url || getDefaultEndpoint().url;
export const getWebSocketURL = () => `wss://${getServerAddressFallback()}`;

const socket_url = `wss://${getServerAddressFallback()}/websockets/v3?app_id=${getAppIdFallback()}&l=${getLanguage().toUpperCase()}&brand=deriv`;

// TODO: If network goes of then we should destroy the current api instance
// and once the network is back we need to create a new api instance.
const api = new DerivAPIBasic({
    connection: new WebSocket(socket_url),
});

export default api;
