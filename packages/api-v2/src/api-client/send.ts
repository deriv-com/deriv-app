import _ from 'lodash';


let _reqSeqNr = 1000;
const REQ_TIMEOUT = 20000;

/**
 * responsible for sending request over given WS and thats it, 
 * no handling of reconnections, no state, nothing, just send
 */
function send(ws: WebSocket, name: string, payload: object | any) {
    const req_id = _reqSeqNr++;

    let promise = new Promise((resolve, reject) => {
        let timeout: NodeJS.Timeout = setTimeout(() => {
            ws.removeEventListener('message', receive);
            reject('Request timed out: ');
        }, REQ_TIMEOUT);

        function receive(messageEvent: any) {
            const data = JSON.parse(messageEvent.data);
            if (data.req_id !== req_id) {
                return;
            }

            ws.removeEventListener('message', receive);
            clearTimeout(timeout);
            resolve(data);
        }

        ws.addEventListener('message', receive);

        payload = payload || {};
        ws.send(JSON.stringify({ 
            [name]: 1, 
            ...payload,
            req_id,
         }));
     });

     return promise;
}

export default send;