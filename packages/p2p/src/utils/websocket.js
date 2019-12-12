import CurrencyUtils from 'deriv-shared/utils/currency';
import ObjectUtils   from 'deriv-shared/utils/object';

let offer_currency,
    ws;

const initial_responses = {};

export const init = (websocket, currency) => {
    ws = websocket;
    offer_currency = currency;
};

const setCurrenciesConfig = (website_status_response) => {
    if (('website_status' in website_status_response) && ObjectUtils.isEmptyObject(CurrencyUtils.currencies_config)) {
        CurrencyUtils.setCurrencies(website_status_response.website_status);
    }
};

const formatMoney = (currency, amount) => (CurrencyUtils.formatMoney(currency, amount, true));

const populateInitialResponses = () => (
    new Promise(resolve => {
        if (ObjectUtils.isEmptyObject(initial_responses)) {
            ws.send({ website_status: 1 }).then((response) => {
                initial_responses.website_status = response;
                setCurrenciesConfig(response);
                resolve();
            });
        } else {
            resolve();
        }
    })
);

const getModifiedP2POfferList = (response) => {
    const length = response.list.length;
    const modified_response = [];
    for (let i = 0; i < length; i++) {
        modified_response[i] = {};

        // offer_currency: "USD"
        // agent_id: "1"
        // agent_loginid: "CR90000051"
        // amount: "100"
        // country: "ID"
        // created_time: "2019-12-12 03:13:40.632565"
        // description: "Please contact via whatsapp 1234"
        // expire_time: "2019-12-12 05:13:40.632565"
        // id: "1"
        // is_active: 1
        // transaction_currency: null
        // max_amount: "100"
        // method: "bank_transfer"
        // min_amount: "10"
        // price: 14500
        // remaining: "0"
        // type: "buy"

        // TODO: add formatMoney function and create display variables for each price field
        modified_response[i].offer_currency          = response.list[i].offer_currency;
        modified_response[i].advertiser_id           = response.list[i].agent_id;
        modified_response[i].offer_amount            = +response.list[i].amount;
        modified_response[i].display_offer_amount    = formatMoney(response.list[i].offer_currency, response.list[i].amount);
        modified_response[i].advertiser_note         = response.list[i].description;
        modified_response[i].offer_id                = response.list[i].id;
        modified_response[i].transaction_currency    = response.list[i].transaction_currency;
        modified_response[i].min_transaction         = +response.list[i].min_amount;
        modified_response[i].display_min_transaction = formatMoney(response.list[i].transaction_currency, response.list[i].min_amount);
        modified_response[i].price_rate              = +response.list[i].price;
        modified_response[i].display_price_rate      = formatMoney(response.list[i].transaction_currency, response.list[i].price);
        modified_response[i].type                    = response.list[i].type;

        // missing in api
        modified_response[i].advertiser           = response.list[i].agent_loginid;

        // TOOD: [p2p-api-request] API should give us the allowed decimal places of local currency
        modified_response[i].transaction_currency_decimals =
            (((response.list[i].price.toString().split('.') || [])[1]) || []).length;

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

const getModifiedP2POrderList = (response) => {
    const length = response.list.length;
    const modified_response = [];
    for (let i = 0; i < length; i++) {
        modified_response[i] = {};

        // "agent_confirmed": {},
        // "agent_id": "1",
        //     "agent_loginid": "CR90000008",
        //     "amount": 50,
        //     "client_confirmed": {},
        // "client_loginid": "CR90000009",
        //     "created_time": "2019-12-11 12:58:54.025566",
        //     "description": {},
        // "id": "1",
        //     "offer_currency": "USD",
        //     "offer_id": "1",
        //     "offer_type": "buy",
        //     "status": "cancelled"


        // TODO: add formatMoney function and create display variables for each price field
        modified_response[i].offer_amount               = +response.list[i].amount;
        modified_response[i].display_offer_amount       = formatMoney(response.list[i].offer_currency, response.list[i].amount);
        modified_response[i].order_purchase_datetime    = new Date(response.list[i].created_time); // API should give epoch
        modified_response[i].advertiser_notes           = response.list[i].description;
        modified_response[i].order_id                   = response.list[i].id;
        modified_response[i].offer_currency             = response.list[i].offer_currency;
        modified_response[i].type                       = response.list[i].offer_type;
        modified_response[i].status                     = response.list[i].status;

        modified_response[i].advertiser_name            = response.list[i].agent_name;
        modified_response[i].price_rate                 = +response.list[i].price;
        modified_response[i].display_price_rate         = formatMoney(response.list[i].local_currency, response.list[i].price);
        modified_response[i].transaction_currency       = response.list[i].local_currency;
        modified_response[i].transaction_amount         = +'100000';
        modified_response[i].display_transaction_amount = formatMoney(response.list[i].local_currency, '100000');
        modified_response[i].remaining_time             = 60 * 60 * 1000;
    }
    return (modified_response);
};

export const WS = async (request) => {
    let modified_response;

    await populateInitialResponses();

    const response = await ws.send(request);

    if (response.p2p_offer_list) {
        // TODO: [p2p-replace-with-api] call the API here and assign the real response
        // response = {
        //     list: [{
        //         agent_id   : 'ABC123',
        //         agent_name : 'Fancy PA name',
        //         currency   : 'IDR',
        //         max        : '1000.00',
        //         min        : '10.00',
        //         offer_id   : '1234sldkfj',
        //         price      : '200.00',
        //         description: 'send money to maybank',
        //     }],
        // };

        modified_response = getModifiedP2POfferList(response.p2p_offer_list);
    }
    if (response.p2p_order_create) {
        modified_response = {
            p2p_order_create: 1,
            order_id        : 'abc1234',
        };
    }
    if (response.p2p_order_list) {
        // response = [{
        //     type          : 'buy',
        //     agent_id      : 'ABC123',
        //     agent_name    : 'Fancy PA name',
        //     local_currency: 'IDR',
        //     offer_id      : '1234sldkfj',
        //     order_id      : 'abc1234',
        //     price         : '200.00',
        //     status        : 'pending',
        // }];
        modified_response = getModifiedP2POrderList(response.p2p_order_list);
    }
    if (response.p2p_order_info) {
        // TODO: [p2p-replace-with-api] call the API here and assign the real response
        modified_response = {
            order_id                  : request.order_id,
            status                    : 'pending',
            type                      : 'buy',
            advertiser_name           : 'Fancy PA name',
            advertiser_notes          : 'Hello I am watermelon',
            order_purchase_datetime   : new Date(),
            price_rate                : 2000000,
            display_price_rate        : formatMoney('IDR', '2,000,000.00'),
            offer_currency            : 'BTC', // The currency that is being purchased
            transaction_currency      : 'IDR', // The currency that is used to purchase the selling currency
            display_offer_amount      : formatMoney('BTC', '0.002931'),
            display_transaction_amount: formatMoney('IDR', '100,000.00'),
            offer_amount              : 0.002931,
            transaction_amount        : 100000,
            remaining_time            : 3600000, // 60 * 60 * 1000
        };
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
