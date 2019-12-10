let ws;

export const init = (websocket) => {
    ws = websocket;
};

export const WS = () => ws;

export const MockWS = (request) => (
    new Promise(resolve => {
        let response,
            modified_response;
        if (request.p2p_offer_list) {
            // TODO: call the API here and assign the real response
            response = {
                list: [{
                    price                : '200.00',
                    min                  : '10.00',
                    max                  : '1000.00',
                    agent_id             : 'ABC123',
                    agent_name           : 'Fancy PA name',
                    type                 : request.type,
                    currency             : 'IDR',
                    max_withdrawal       : '100000.00',
                    min_withdrawal       : '1000.00',
                    name                 : 'John Doe',
                    paymentagent_loginid : 'CR123',
                    summary              : 'send money to maybank',
                    supported_banks      : 'maybank,cimb',
                    telephone            : '+123',
                    url                  : 'www.test.com',
                    withdrawal_commission: '5%',
                }],
            };
            const length = 20; // TODO: change to response.list.length
            modified_response = [] ;
            for (let i = 0; i < length; i++) {
                modified_response[i] = {};
                // TODO: change `response.list[0]` to `response.list[i]` once we have API
                modified_response[i].advertiser           = response.list[0].agent_name;
                modified_response[i].advertiser_note      = response.list[0].summary;
                modified_response[i].offer_currency       = 'USD'; // TODO: update this to get current client's currency
                modified_response[i].amount               = +response.list[0].max;
                modified_response[i].transaction_currency = response.list[0].currency;
                modified_response[i].price                = +response.list[0].price;
                modified_response[i].min_transaction      = +response.list[0].min;
                modified_response[i].type                 = response.list[0].type;

                modified_response[i].transction_currency_decimals = (((response.list[0].price.split('.') || [])[1]) || []).length;
                modified_response[i].offer_currency_decimals      = (((response.list[0].max.split('.') || [])[1]) || []).length;
            }
        }
        // TODO: remove this timeout once we have API
        setTimeout(() => {
            resolve(modified_response);
        }, 500);
    })
);
