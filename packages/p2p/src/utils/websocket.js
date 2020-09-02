import { setCurrencies, formatMoney, getCurrencies, isEmptyObject, getPropertyValue } from '@deriv/shared';

import { localize } from 'Components/i18next';
// import { convertToMillis, getFormattedDateString } from 'Utils/date-time';

let ws, transaction_currency_decimals;

const initial_responses = {};

export const init = (websocket, local_currency_decimal_places) => {
    ws = websocket;
    transaction_currency_decimals = local_currency_decimal_places;
};

const setCurrenciesConfig = website_status_response => {
    if ('website_status' in website_status_response && isEmptyObject(getCurrencies())) {
        setCurrencies(website_status_response.website_status);
    }
};

const fmtMoney = (currency, amount) => formatMoney(currency, amount, true);

const populateInitialResponses = async () => {
    if (isEmptyObject(initial_responses)) {
        initial_responses.website_status = await ws.send({ website_status: 1 });
        setCurrenciesConfig(initial_responses.website_status);
    }
};

const map_payment_method = {
    bank_transfer: localize('Bank transfer'),
};

const getModifiedP2PAdvertList = (response, is_original) => {
    return response;
    // only show active adverts
    const filtered_list = response.list.filter(offer => !!+offer.is_active);

    const length = filtered_list.length;
    const modified_response = [];
    for (let i = 0; i < length; i++) {
        const offer_currency = filtered_list[i].account_currency;
        const transaction_currency = filtered_list[i].local_currency;

        const offer_currency_decimals = getPropertyValue(initial_responses, [
            'website_status',
            'website_status',
            'currencies_config',
            offer_currency,
            'fractional_digits',
        ]);

        const available_amount = +filtered_list[i].remaining_amount;
        const offer_amount = +filtered_list[i].amount;
        const min_transaction = +filtered_list[i].min_order_amount; // for advertiser usage in offer creation/update
        const max_transaction = +filtered_list[i].max_order_amount; // for advertiser usage in offer creation/update
        const min_available = +filtered_list[i].min_order_amount_limit; // for client usage in order creation
        const max_available = +filtered_list[i].max_order_amount_limit; // for client usage in order creation
        const price_rate = +filtered_list[i].rate;
        const payment_method = filtered_list[i].payment_method;

        modified_response[i] = {
            available_amount,
            contact_info: filtered_list[i].contact_info,
            min_available,
            max_available,
            max_transaction,
            min_transaction,
            offer_amount,
            offer_currency,
            offer_currency_decimals,
            payment_info: filtered_list[i].payment_info,
            payment_method,
            price_rate,
            transaction_currency,
            transaction_currency_decimals,
            advertiser_name: getPropertyValue(filtered_list[i], ['advertiser_details', 'name']),
            advertiser_id: getPropertyValue(filtered_list[i], ['advertiser_details', 'id']),
            advertiser_instructions: filtered_list[i].description,
            display_available_amount: fmtMoney(offer_currency, available_amount),
            display_max_available: fmtMoney(offer_currency, max_available), // for displaying limit fields in buy/sell and ads table
            display_min_available: fmtMoney(offer_currency, min_available), // for displaying limit fields in buy/sell and ads table
            display_max_order_amount: fmtMoney(offer_currency, max_transaction),
            display_min_order_amount: fmtMoney(offer_currency, min_transaction),
            display_offer_amount: fmtMoney(offer_currency, offer_amount),
            display_payment_method: map_payment_method[payment_method] || payment_method,
            display_price_rate: fmtMoney(transaction_currency, price_rate),
            id: filtered_list[i].id,
            // for view in my ads tab (advertiser perspective), we should show the original type of the ad
            // for view in buy/sell table (client perspective), we should show the counter-party type
            type: is_original ? filtered_list[i].type : filtered_list[i].counterparty_type,
        };
    }
    return modified_response;
};

export const getModifiedP2POrderList = response => {
    const modified_response = [];
    response.forEach((list_item, idx) => {
        modified_response[idx] = getModifiedP2POrder(list_item);
    });

    return modified_response;
};

export const requestWS = async request => {
    await populateInitialResponses();
    return await ws.send(request);
    // return getModifiedResponse(response);
};

const getModifiedResponse = response => {
    let modified_response = response;

    if (response.p2p_advert_list || response.p2p_advertiser_adverts) {
        modified_response = getModifiedP2PAdvertList(
            response.p2p_advert_list || response.p2p_advertiser_adverts,
            response.p2p_advertiser_adverts
        );
    } else if (response.p2p_order_info) {
        modified_response = getModifiedP2POrder(response.p2p_order_info);
    }

    return modified_response;
};

export const subscribeWS = (request, callbacks) =>
    ws.p2pSubscribe(request, response => {
        callbacks.map(callback => callback(response));
    });

export const waitWS = args => ws.wait(args);
