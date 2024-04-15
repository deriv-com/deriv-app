import _ from 'lodash';
import lightweightSend from './send';


/*
 * TODO: handle reconnection
 * TODO: handle multiple subscriptions to the same channel
 */
async function backendSubscribe(ws: WebSocket, name: string, payload: any, onData: Function) {
    let reqId : number | null = null;
    let subscriptionId : string | null = null;
    let data : any = null;

    async function connect(_ws: WebSocket) {
        ws = _ws;
        data = await lightweightSend(ws, name, {
            subscribe: 1,
            ...payload
        });
    
        onData(data);
    }
    

    function receive(messageEvent: any) {
        const data = JSON.parse(messageEvent.data);

        if (data.req_id !== reqId) {
            return;
        }

        onData(data);
    }

    async function reconnect(ws: WebSocket) {
        connect(ws);
    }
    
    await connect(ws);
    ws.addEventListener('message', receive)
    ws.addEventListener('close', () => {
        ws.removeEventListener('message', receive);
    });


    return { 
        unsubcribe: () => {
            ws.removeEventListener('message', receive);
            lightweightSend(ws, 'forget', { forget: subscriptionId });
        },
        data, 
        reqId,
        subscriptionId,
        reconnect,
    }
}


export default backendSubscribe;