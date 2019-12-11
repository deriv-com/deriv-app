import ObjectUtils from 'deriv-shared/utils/object';

let transaction_currency,
    ws;

const initial_responses = {};

export const init = (websocket, currency) => {
    ws = websocket;
    transaction_currency = currency;
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
        modified_response[i].advertiser           = response.list[0].agent_name;
        modified_response[i].advertiser_note      = response.list[0].summary;
        modified_response[i].offer_currency       = transaction_currency;
        modified_response[i].offer_id             = response.list[0].offer_id;
        modified_response[i].amount               = +response.list[0].max;
        modified_response[i].transaction_currency = response.list[0].currency;
        modified_response[i].price                = +response.list[0].price;
        modified_response[i].min_transaction      = +response.list[0].min;
        modified_response[i].type                 = response.list[0].type;

        // TOOD: [p2p-api-request] API should give us the allowed decimal places of local currency
        modified_response[i].transaction_currency_decimals =
            (((response.list[0].price.split('.') || [])[1]) || []).length;

        modified_response[i].offer_currency_decimals =
            ObjectUtils.getPropertyValue(initial_responses, [
                'website_status',
                'website_status',
                'currencies_config',
                transaction_currency,
                'fractional_digits',
            ]);
    }
    return (modified_response);
};

export const MockWS = (request) => (
    new Promise(resolve => {
        let response,
            modified_response;

        populateInitialResponses().then( async () => {

            if (request.p2p_offer_list) {
                // TODO: [p2p-replace-with-api] call the API here and assign the real response
                response = {
                    list: [{
                        agent_id             : 'ABC123',
                        agent_name           : 'Fancy PA name',
                        currency             : 'IDR',
                        max                  : '1000.00',
                        min                  : '10.00',
                        offer_id             : '1234sldkfj',
                        price                : '200.00',

                        // TOOD: [p2p-api-request] API should return this
                        type                 : request.type,
                        summary              : 'send money to maybank',
                    }],
                };
                modified_response = getModifiedP2POfferList(response);
            }
            if (request.p2p_order_create) {
                modified_response = {
                    p2p_order_create: 1,
                    order_id: 'abc1234'
                }
                // const order_info = await MockWs({ p2p_order_info: 1, order_id: request.offer_id });
                // modified_response = order_info;
            }
            if (request.p2p_order_info) {
                // TODO: [p2p-replace-with-api] call the API here and assign the real response
                modified_response = {
                    order_id: request.order_id,
                    status: 'pending',
                    type: 'buy',
                    advertiser_notes: 'Hello I am watermelon',
                    order_purchase_datetime: new Date(),
                    counterparty: 'John Doe',
                    price_rate: 2000000,
                    display_price_rate: '2,000,000.00',
                    offer_currency: 'BTC', // The currency that is being purchased
                    transaction_currency: 'IDR', // The currency that is used to purchase the selling currency
                    display_offer_amount: '0.002931',
                    display_transaction_amount: '100,000.00',
                    offer_amount: 0.002931,
                    transaction_amount: 100000,
                    remaining_time: 3600000, // 60 * 60 * 1000
                    remainingTimeInterval: null,
                }
            }
            resolve(modified_response);
        });
    })
);
