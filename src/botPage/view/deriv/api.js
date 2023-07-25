import { getLanguage, getAppIdFallback, getServerAddressFallback } from '@storage';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';

const socket_url = `wss://${getServerAddressFallback()}/websockets/v3?app_id=${getAppIdFallback()}&l=${getLanguage().toUpperCase()}&brand=deriv`;

// TODO: If network goes of then we should destroy the current api instance
// and once the network is back we need to create a new api instance.
const api = new DerivAPIBasic({
    connection: new WebSocket(socket_url),
});

export default api;
