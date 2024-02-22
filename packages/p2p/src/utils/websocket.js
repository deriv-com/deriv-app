import { setCurrencies, getCurrencies, isEmptyObject } from '@deriv/shared';

let ws;

const initial_responses = {};

export const init = websocket => {
    ws = websocket;
};

const setCurrenciesConfig = website_status_response => {
    if ('website_status' in website_status_response && isEmptyObject(getCurrencies())) {
        setCurrencies(website_status_response.website_status);
    }
};

const populateInitialResponses = async () => {
    if (isEmptyObject(initial_responses)) {
        initial_responses.website_status = await ws.send({ website_status: 1 });
        setCurrenciesConfig(initial_responses.website_status);
    }
};

export const requestWS = async request => {
    // Added a check to proceed only if ws is available
    if (ws) {
        await populateInitialResponses();
        return ws.authorized.send(request);
    }
    return null;
};

export const subscribeWS = (request, callbacks, enabled = true) => {
    if (!enabled) return null;
    return ws.p2pSubscribe(request, response => {
        callbacks.map(callback => callback(response));
    });
};

export const waitWS = args => ws.wait(args);
