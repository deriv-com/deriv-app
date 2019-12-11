import ObjectUtils from 'deriv-shared/utils/object';

let offer_currency,
    ws;

const initial_responses = {};

export const init = (websocket, currency) => {
    ws = websocket;
    offer_currency = currency;
};

export const WS = () => ws;

const populateInitialResponses = () => (
    new Promise(resolve => {
        if (ObjectUtils.isEmptyObject(initial_responses)) {
            ws.send({ website_status: 1 }).then((response) => {
                initial_responses.website_status = response;
                resolve();
            });
        } else {
            resolve();
        }
    })
);

const getModifiedP2POfferList = (response) => {
    const length = 20; // TODO: [p2p-replace-with-api] change to response.list.length once we have API
    const modified_response = [];
    for (let i = 0; i < length; i++) {
        modified_response[i] = {};
        // TODO: [p2p-replace-with-api] change `response.list[0]` to `response.list[i]` once we have API
        // TODO: add formatMoney function and create display variables for each price field
        modified_response[i].advertiser_id        = response.list[0].agent_id;
        modified_response[i].advertiser           = response.list[0].agent_name;
        modified_response[i].advertiser_note      = response.list[0].description;
        modified_response[i].offer_currency       = offer_currency;
        modified_response[i].offer_id             = response.list[0].offer_id;
        modified_response[i].amount               = +response.list[0].max;
        modified_response[i].transaction_currency = response.list[0].currency;
        modified_response[i].price                = +response.list[0].price;
        modified_response[i].min_transaction      = +response.list[0].min;
        // TODO: [p2p-replace-with-api] get type from response.echo_req.type
        modified_response[i].type                 = 'buy';

        // TOOD: [p2p-api-request] API should give us the allowed decimal places of local currency
        modified_response[i].transaction_currency_decimals =
            (((response.list[0].price.split('.') || [])[1]) || []).length;

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
    const length = 10; // TODO: [p2p-replace-with-api] change to response.list.length once we have API
    const modified_response = [];
    for (let i = 0; i < length; i++) {

        // type: 'buy',
        // agent_id: 'ABC123',
        // agent_name: 'Fancy PA name',
        // local_currency: 'IDR',
        // offer_id: '1234sldkfj',
        // order_id: 'abc1234',
        // price: '200.00',
        // status: 'pending'

        modified_response[i] = {};
        // TODO: [p2p-replace-with-api] change `response.list[0]` to `response.list[i]` once we have API
        // TODO: add formatMoney function and create display variables for each price field
        modified_response[i].type                       = response[0].type;
        modified_response[i].order_id                   = response[0].order_id;
        modified_response[i].status                     = response[0].status;
        modified_response[i].advertiser_notes           = 'Hello I am watermelon';
        modified_response[i].order_purchase_datetime    = new Date();
        modified_response[i].counterparty               = 'John Doe';
        modified_response[i].price_rate                 = +response[0].price;
        modified_response[i].display_price_rate         = +response[0].price;
        modified_response[i].offer_currency             = offer_currency;
        modified_response[i].transaction_currency       = response[0].local_currency;
        modified_response[i].offer_amount               = +'0.002931';
        modified_response[i].display_offer_amount       = '0.002931';
        modified_response[i].transaction_amount         = +'100000';
        modified_response[i].display_transaction_amount = '100000';
        modified_response[i].remaining_time             = 60 * 60 * 1000;
    }
    return (modified_response);
};

export const MockWS = (request) => (
    new Promise(resolve => {
        let response,
            modified_response;

        populateInitialResponses().then(async () => {

            if (request.p2p_offer_list) {
                // TODO: [p2p-replace-with-api] call the API here and assign the real response
                response = {
                    list: [{
                        agent_id   : 'ABC123',
                        agent_name : 'Fancy PA name',
                        currency   : 'IDR',
                        max        : '1000.00',
                        min        : '10.00',
                        offer_id   : '1234sldkfj',
                        price      : '200.00',
                        description: 'send money to maybank',
                    }],
                };
                
                modified_response = getModifiedP2POfferList(response);
            }
            if (request.p2p_order_create) {
                modified_response = {
                    p2p_order_create: 1,
                    order_id        : 'abc1234',
                };
                // const order_info = await MockWs({ p2p_order_info: 1, order_id: request.offer_id });
                // modified_response = order_info;
            }
            if (request.p2p_order_list) {
                response = [{
                    type          : 'buy',
                    agent_id      : 'ABC123',
                    agent_name    : 'Fancy PA name',
                    local_currency: 'IDR',
                    offer_id      : '1234sldkfj',
                    order_id      : 'abc1234',
                    price         : '200.00',
                    status        : 'pending',
                }];
                modified_response = getModifiedP2POrderList(response);
            }
            if (request.p2p_order_info) {
                // TODO: [p2p-replace-with-api] call the API here and assign the real response
                modified_response = {
                    order_id                  : request.order_id,
                    status                    : 'pending',
                    type                      : 'buy',
                    advertiser_notes          : 'Hello I am watermelon',
                    order_purchase_datetime   : new Date(),
                    counterparty              : 'John Doe',
                    price_rate                : 2000000,
                    display_price_rate        : '2,000,000.00',
                    offer_currency            : 'BTC', // The currency that is being purchased
                    transaction_currency      : 'IDR', // The currency that is used to purchase the selling currency
                    display_offer_amount      : '0.002931',
                    display_transaction_amount: '100,000.00',
                    offer_amount              : 0.002931,
                    transaction_amount        : 100000,
                    remaining_time            : 3600000, // 60 * 60 * 1000
                    remainingTimeInterval     : null,
                };
            }
            if (request.p2p_order_cancel) {
                modified_response = {
                    p2p_order_cancel: 1,
                    order_id        : 'abc1234',
                };
            }
            if (request.p2p_order_update) {
                modified_response = {
                    p2p_order_update: 1,
                    order_id        : 'abc1234',
                };
            }
            resolve(modified_response);
        });
    })
);
