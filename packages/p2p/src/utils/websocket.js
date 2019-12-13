import CurrencyUtils from 'deriv-shared/utils/currency';
import ObjectUtils   from 'deriv-shared/utils/object';

let ws;

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
    }
};

const getModifiedP2POfferList = (response) => {
    const length = response.list.length;
    const modified_response = [];
    for (let i = 0; i < length; i++) {
        modified_response[i] = {};

        const offer_currency       = response.list[i].account_currency;
        const transaction_currency = response.list[i].transaction_currency;

        modified_response[i].offer_currency          = offer_currency;
        modified_response[i].advertiser_id           = response.list[i].agent_id;
        modified_response[i].offer_amount            = +response.list[i].max_amount;
        modified_response[i].display_offer_amount    = formatMoney(offer_currency, response.list[i].max_amount);
        modified_response[i].advertiser_note         = response.list[i].description;
        modified_response[i].offer_id                = response.list[i].id;
        modified_response[i].transaction_currency    = response.list[i].transaction_currency;
        modified_response[i].min_transaction         = +response.list[i].min_amount;
        modified_response[i].display_min_transaction = formatMoney(offer_currency, response.list[i].min_amount);
        modified_response[i].price_rate              = +response.list[i].price;
        modified_response[i].display_price_rate      = formatMoney(transaction_currency, response.list[i].price);
        modified_response[i].type                    = response.list[i].type;

        // TOOD: [p2p-api-request] missing in API
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

const getModifiedP2POrder = (response) => {
    const modified_response = {};

    modified_response.offer_amount               = +response.amount;
    modified_response.display_offer_amount       = formatMoney(response.offer_currency, response.amount);
    modified_response.order_purchase_datetime    = new Date(response.created_time); // TOOD: [p2p-api-request] API should give epoch
    modified_response.advertiser_notes           = response.description;
    modified_response.order_id                   = response.id;
    modified_response.offer_currency             = response.offer_currency;
    modified_response.type                       = response.offer_type;
    modified_response.status                     = response.status;

    // TOOD: [p2p-api-request] missing in API
    modified_response.advertiser_name            = response.agent_name;
    modified_response.price_rate                 = +response.price;
    modified_response.display_price_rate         = formatMoney(response.local_currency, response.price);
    modified_response.transaction_currency       = response.local_currency;
    modified_response.transaction_amount         = +response.transaction_amount;
    modified_response.display_transaction_amount = formatMoney(response.local_currency, response.transaction_amount);
    modified_response.remaining_time             = 60 * 60 * 1000;

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
    }
    if (response.p2p_order_list) {
        modified_response = getModifiedP2POrderList(response.p2p_order_list);
    }
    if (response.p2p_order_info) {
        modified_response = getModifiedP2POrder(response.p2p_order_info);
    }
    if (response.p2p_order_cancel) {
        modified_response = {
            p2p_order_cancel: 1,
        };
    }
    if (response.p2p_order_confirm) {
        modified_response = {
            p2p_order_confirm: 1,
        };
    }

    return modified_response;
};
