import CurrencyUtils         from 'deriv-shared/utils/currency';
import ObjectUtils           from 'deriv-shared/utils/object';
import {
    convertToMillis,
    getFormattedDateString } from 'Utils/date-time';

let ws;
let is_agent = false;

const initial_responses = {};

export const init = (websocket) => {
    ws = websocket;
};

const setCurrenciesConfig = (website_status_response) => {
    if (('website_status' in website_status_response) && ObjectUtils.isEmptyObject(CurrencyUtils.currencies_config)) {
        CurrencyUtils.setCurrencies(website_status_response.website_status);
    }
};

const formatMoney = (currency, amount) => (CurrencyUtils.formatMoney(currency, amount, true));

const populateInitialResponses = async () => {
    if (ObjectUtils.isEmptyObject(initial_responses)) {
        initial_responses.website_status = await ws.send({ website_status: 1 });
        setCurrenciesConfig(initial_responses.website_status);

        const agent_info = await ws.send({ p2p_agent_info: 1 });
        if (!agent_info.error) {
            is_agent = true;
        }
    }
};

const getModifiedP2POfferList = (response) => {
    const length = response.list.length;
    const modified_response = [];
    for (let i = 0; i < length; i++) {
        modified_response[i] = {};

        const offer_currency       = response.list[i].account_currency;
        const transaction_currency = response.list[i].local_currency;

        // hide buy/sell button for agent accounts
        modified_response[i].is_agent = is_agent;

        modified_response[i].offer_currency          = offer_currency;
        modified_response[i].advertiser_id           = response.list[i].agent_id;
        modified_response[i].offer_amount            = +response.list[i].max_amount;
        modified_response[i].display_offer_amount    = formatMoney(offer_currency, response.list[i].max_amount);
        modified_response[i].advertiser_note         = response.list[i].description;
        modified_response[i].offer_id                = response.list[i].offer_id;
        modified_response[i].transaction_currency    = transaction_currency;
        modified_response[i].min_transaction         = +response.list[i].min_amount;
        modified_response[i].display_min_transaction = formatMoney(offer_currency, response.list[i].min_amount);
        modified_response[i].price_rate              = +response.list[i].price;
        modified_response[i].display_price_rate      = formatMoney(transaction_currency, response.list[i].price);
        modified_response[i].type                    = response.list[i].type;
        modified_response[i].advertiser              = response.list[i].agent_name;

        // TOOD: [p2p-api-request] API should give us the allowed decimal places of local currency
        modified_response[i].transaction_currency_decimals = 2;
        // (((response.list[i].price.toString().split('.') || [])[1]) || []).length;

        modified_response[i].offer_currency_decimals =
            ObjectUtils.getPropertyValue(initial_responses, [
                'website_status',
                'website_status',
                'currencies_config',
                offer_currency,
                'fractional_digits',
            ]);
    }
    return (modified_response);
};

// for agents API still returns buy if client created a buy order
// but agent should see that as sell type so they can go through the sell flow
const map_agent_action = { buy: 'sell', sell: 'buy' };

const getModifiedP2POrder = (response) => {
    const modified_response = {};

    modified_response.type = is_agent ? map_agent_action[response.type] : response.type;

    modified_response.offer_amount               = +response.amount;
    modified_response.display_offer_amount       = formatMoney(response.account_currency, response.amount);
    modified_response.order_purchase_datetime    = getFormattedDateString(
        new Date(convertToMillis(response.created_time))
    );
    modified_response.advertiser_notes           = response.description;
    modified_response.order_id                   = response.order_id;
    modified_response.offer_currency             = response.account_currency;
    modified_response.status                     = response.status;
    modified_response.advertiser_name            = response.agent_name;
    modified_response.price_rate                 = +response.price;
    modified_response.display_price_rate         = formatMoney(response.local_currency, response.price);
    modified_response.transaction_currency       = response.local_currency;
    modified_response.transaction_amount         = +response.transaction_amount;
    modified_response.display_transaction_amount = formatMoney(response.local_currency, response.transaction_amount);

    // TOOD: calculate this based on expiry time - created time
    // const remaining_seconds = (+response.expiry_time) - (+response.created_time);
    modified_response.order_expiry_millis         = convertToMillis(response.expiry_time);

    return modified_response;
};

const getModifiedP2POrderList = (response) => {
    const modified_response = [];
    response.list.forEach((list_item, idx) => {
        modified_response[idx] = getModifiedP2POrder(list_item);
    });
    return modified_response;
};

export const WS = async (request) => {
    await populateInitialResponses();

    const response = await ws.send(request);

    let modified_response = response;

    if (response.p2p_offer_list) {
        modified_response = getModifiedP2POfferList(response.p2p_offer_list);
    } else if (response.p2p_order_list) {
        modified_response = getModifiedP2POrderList(response.p2p_order_list);
    } else if (response.p2p_order_info) {
        modified_response = getModifiedP2POrder(response.p2p_order_info);
    }

    return modified_response;
};
