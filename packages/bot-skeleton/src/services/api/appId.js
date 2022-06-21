import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL, website_name } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';

export const generateDerivApiInstance = () => {
    const socket_url = `wss://${getSocketURL()}/websockets/v3?app_id=${getAppId()}&l=${getLanguage()}&brand=${website_name.toLowerCase()}`;
    const deriv_api = new DerivAPIBasic({
        connection: new WebSocket(socket_url),
    });
    return deriv_api;
};

const api = generateDerivApiInstance();

export default api;
