import { TSocketResponseData, TSocketEndpointNames, TSocketRequestPayload } from '../../types';

const REQ_TIMEOUT = 20000;

// sequence number for requests
let reqSeqNumber = 0;

/**
 * responsible for sending request over given WS and thats it,
 * no handling of reconnections, no state, nothing, just send
 * even request seq number is outside of its scope (reason being, that req_seq needs to be also used by the subscriptions)
 */
function request(
    ws: WebSocket,
    name: TSocketEndpointNames,
    payload: TSocketRequestPayload<TSocketEndpointNames>['payload']
): Promise<TSocketResponseData<TSocketEndpointNames>> {
    const req_id = ++reqSeqNumber;

    const promise: Promise<TSocketResponseData<TSocketEndpointNames>> = new Promise((resolve, reject) => {
        const timeout: NodeJS.Timeout = setTimeout(() => {
            ws.removeEventListener('message', receive);
            reject(new Error('Request timeout'));
        }, REQ_TIMEOUT);

        function receive(messageEvent: MessageEvent) {
            const data = JSON.parse(messageEvent.data);
            if (data.req_id !== req_id) {
                return;
            }

            ws.removeEventListener('message', receive);
            clearTimeout(timeout);
            resolve(data);
        }

        ws.addEventListener('message', receive);

        ws.send(
            JSON.stringify({
                [name]: 1,
                ...payload,
                req_id,
            })
        );
    });

    return promise;
}

/**
 * reset request sequence number
 * used in tests
 * havent found better way to reset it within tests themselves
 * without exposting extra function
 */
export function resetReqSeqNumber() {
    reqSeqNumber = 0;
}

export default request;
