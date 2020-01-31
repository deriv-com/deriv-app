import CurrencyUtils         from '@deriv/shared/utils/currency';
import ObjectUtils           from '@deriv/shared/utils/object';
import { localize }          from 'Components/i18next';
import {
    convertToMillis,
    getFormattedDateString } from 'Utils/date-time';

let ws,
    transaction_currency_decimals;

const initial_responses = {};

export const init = (websocket, local_currency_decimal_places) => {
    ws = websocket;
    transaction_currency_decimals = local_currency_decimal_places;
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
    // only show active offers
    const filtered_list = response.list.filter((offer) => !!+offer.is_active);

    const length = filtered_list.length;
    const modified_response = [];
    for (let i = 0; i < length; i++) {
        const offer_currency       = filtered_list[i].account_currency;
        const transaction_currency = filtered_list[i].local_currency;

        const offer_currency_decimals = ObjectUtils.getPropertyValue(initial_responses, [
            'website_status',
            'website_status',
            'currencies_config',
            offer_currency,
            'fractional_digits',
        ]);

        const available_amount = +filtered_list[i].remaining_amount;
        const offer_amount     = +filtered_list[i].amount;
        const min_transaction  = +filtered_list[i].min_amount; // for agent usage in offer creation/update
        const max_transaction  = +filtered_list[i].max_amount; // for agent usage in offer creation/update
        const min_available    = +filtered_list[i].min_amount_limit; // for client usage in order creation
        const max_available    = +filtered_list[i].max_amount_limit; // for client usage in order creation
        const price_rate       = +filtered_list[i].rate;
        const payment_method   = filtered_list[i].method;

        modified_response[i] = {
            available_amount,
            min_available,
            max_available,
            max_transaction,
            min_transaction,
            offer_amount,
            offer_currency,
            offer_currency_decimals,
            payment_method,
            price_rate,
            transaction_currency,
            transaction_currency_decimals,
            advertiser_name         : filtered_list[i].agent_name,
            advertiser_id           : filtered_list[i].agent_id,
            advertiser_notes        : filtered_list[i].offer_description,
            display_available_amount: formatMoney(offer_currency, available_amount),
            display_max_available   : formatMoney(offer_currency, max_available), // for displaying limit fields in buy/sell and ads table
            display_min_available   : formatMoney(offer_currency, min_available), // for displaying limit fields in buy/sell and ads table
            display_offer_amount    : formatMoney(offer_currency, offer_amount),
            display_payment_method  : map_payment_method[payment_method] || payment_method,
            display_price_rate      : formatMoney(transaction_currency, price_rate),
            offer_id                : filtered_list[i].offer_id,
            type                    : filtered_list[i].type,
        };
    }
    return (modified_response);
};

const getModifiedP2POrder = (response) => {
    const offer_currency       = response.account_currency;
    const transaction_currency = response.local_currency;

    const offer_amount       = +response.amount;
    const price_rate         = +response.rate;
    const transaction_amount = +response.price;
    const payment_method     = map_payment_method.bank_transfer; // TODO: [p2p-replace-with-api] add payment method to order details once API has it
    // const payment_method = response.method;

    return {
        offer_amount,
        offer_currency,
        price_rate,
        transaction_amount,
        transaction_currency,
        advertiser_name           : response.agent_name,
        advertiser_notes          : response.offer_description,
        display_offer_amount      : formatMoney(offer_currency, offer_amount),
        display_payment_method    : map_payment_method[payment_method] || payment_method,
        display_price_rate        : formatMoney(offer_currency, price_rate),
        display_transaction_amount: formatMoney(transaction_currency, transaction_amount),
        order_expiry_millis       : convertToMillis(response.expiry_time),
        order_id                  : response.order_id,
        order_purchase_datetime   : getFormattedDateString(new Date(convertToMillis(response.created_time))),
        status                    : response.status,
        type                      : response.type,
    };
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

    return getModifiedResponse(response);
};

const getModifiedResponse = (response) => {
    let modified_response = response;

    if (response.p2p_offer_list || response.p2p_agent_offers) {
        modified_response = getModifiedP2POfferList(response.p2p_offer_list || response.p2p_agent_offers);
    } else if (response.p2p_order_list) {
        modified_response = getModifiedP2POrderList(response.p2p_order_list);
    } else if (response.p2p_order_info) {
        modified_response = getModifiedP2POrder(response.p2p_order_info);
    }

    return modified_response;
};

export const subscribeWS = (request, cb) => {
    ws.p2pSubscribe(request, (response) => {
        cb(getModifiedResponse(response));
    });
};
