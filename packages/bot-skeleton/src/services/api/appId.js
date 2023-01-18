import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL, website_name } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';

export const generateDerivApiInstance = () => {
    const socket_url = `wss://${getSocketURL()}/websockets/v3?app_id=${getAppId()}&l=${getLanguage()}&brand=${website_name.toLowerCase()}`;
    const deriv_socket = new WebSocket(socket_url);
    const deriv_api = new DerivAPIBasic({
        connection: deriv_socket,
    });
    return deriv_api;
};
