import { LiveApi } from 'binary-live-api';
import { getLanguage } from '@deriv/translations';
import AppIds from './appIdResolver';

const getCustomEndpoint = () => ({
    url: localStorage.getItem('config.server_url'),
    appId: localStorage.getItem('config.app_id'),
});

const isRealAccount = () => {
    const accountList = JSON.parse(localStorage.getItem('tokenList') || '{}');
    const activeToken = localStorage.getItem('activeToken') || [];
    let activeAccount = null;
    let isReal = false;
    try {
        activeAccount = accountList.filter(account => account.token === activeToken);
        isReal = !activeAccount[0].accountName.startsWith('VRT');
    } catch (e) {} // eslint-disable-line no-empty
    return isReal;
};

const getDomainAppId = () => AppIds[document.location.hostname.replace(/^www./, '')];

const getDefaultEndpoint = () => ({
    url: isRealAccount() ? 'green.binaryws.com' : 'blue.binaryws.com',
    appId: localStorage.getItem('config.default_app_id') || getDomainAppId() || 19111,
});

const getServerAddressFallback = () => getCustomEndpoint().url || getDefaultEndpoint().url;

const getAppIdFallback = () => getCustomEndpoint().appId || getDefaultEndpoint().appId;

const getWebSocketURL = () => `wss://${getServerAddressFallback()}/websockets/v3`;

export const generateLiveApiInstance = () =>
    new LiveApi({
        apiUrl: getWebSocketURL(),
        language: getLanguage().toUpperCase(),
        appId: getAppIdFallback(),
    });
