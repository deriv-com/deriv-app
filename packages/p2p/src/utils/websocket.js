import CurrencyUtils         from '@deriv/shared/utils/currency';
import ObjectUtils           from '@deriv/shared/utils/object';
import { localize }          from 'Components/i18next';
import {
    convertToMillis,
    getFormattedDateString } from 'Utils/date-time';

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

const map_payment_method = {
    bank_transfer: localize('Bank transfer'),
};

const getModifiedP2POfferList = (response) => {
    const length = response.list.length;
    const modified_response = [];
    for (let i = 0; i < length; i++) {
        modified_response[i] = {};

        const offer_currency       = response.list[i].account_currency;
        const transaction_currency = response.list[i].local_currency;

        modified_response[i].available_amount         = +response.list[i].amount - +response.list[i].amount_used;
        modified_response[i].display_available_amount =
            formatMoney(offer_currency,+response.list[i].amount - +response.list[i].amount_used);

        modified_response[i].offer_currency          = offer_currency;
        modified_response[i].advertiser_id           = response.list[i].agent_id;
        modified_response[i].offer_amount            = +response.list[i].amount;
        // TODO: [p2p-replace-with-api] use display value from API when formatting works
        modified_response[i].display_offer_amount    = formatMoney(offer_currency, response.list[i].amount);
        modified_response[i].advertiser_note         = response.list[i].offer_description;
        modified_response[i].offer_id                = response.list[i].offer_id;
        modified_response[i].transaction_currency    = transaction_currency;
        modified_response[i].min_transaction         = +response.list[i].min_amount;
        // TODO: [p2p-replace-with-api] use display value from API when formatting works
        modified_response[i].display_min_transaction = formatMoney(offer_currency, response.list[i].min_amount);
        modified_response[i].max_transaction         = response.list[i].max_amount;
        modified_response[i].display_max_transaction = formatMoney(offer_currency, response.list[i].max_amount);
        modified_response[i].price_rate              = +response.list[i].rate;
        // TODO: [p2p-replace-with-api] use display value from API when formatting works
        modified_response[i].display_price_rate      = formatMoney(transaction_currency, response.list[i].rate);
        modified_response[i].type                    = response.list[i].type;
        modified_response[i].advertiser              = response.list[i].agent_name;

        modified_response[i].payment_method = map_payment_method[response.list[i].method] || response.list[i].method;

        // TOOD: [p2p-api-request] API should give us the allowed decimal places of local currency
        modified_response[i].transaction_currency_decimals = 2;
        // (((response.list[i].rate_display.toString().split('.') || [])[1]) || []).length;

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

    modified_response.type                       = response.type;
    modified_response.offer_amount               = +response.amount;
    // TODO: [p2p-replace-with-api] use display value from API when formatting works
    modified_response.display_offer_amount       = formatMoney(response.local_currency, response.amount);
    modified_response.order_purchase_datetime    = getFormattedDateString(
        new Date(convertToMillis(response.created_time))
    );
    modified_response.advertiser_notes           = response.offer_description;
    modified_response.order_id                   = response.order_id;
    modified_response.offer_currency             = response.account_currency;
    modified_response.status                     = response.status;
    modified_response.advertiser_name            = response.agent_name;
    modified_response.price_rate                 = +response.rate;
    // TODO: [p2p-replace-with-api] use display value from API when formatting works
    modified_response.display_price_rate         = formatMoney(response.local_currency, response.rate);
    modified_response.transaction_currency       = response.local_currency;
    modified_response.transaction_amount         = +response.price;
    // TODO: [p2p-replace-with-api] use display value from API when formatting works
    modified_response.display_transaction_amount = formatMoney(response.local_currency, response.price);
    modified_response.order_expiry_millis         = convertToMillis(response.expiry_time);

    // TODO: [p2p-replace-with-api] add payment method to order details once API has it

    return modified_response;
};

const getModifiedP2POrderList = (response) => {
    const modified_response = [];
    response.list.forEach((list_item, idx) => {
        modified_response[idx] = getModifiedP2POrder(list_item);
    });
    return modified_response;
};

export const requestWS = async (request) => {
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
