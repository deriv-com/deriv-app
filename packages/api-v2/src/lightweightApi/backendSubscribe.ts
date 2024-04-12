import _ from 'lodash';
import lightweightSend from './lightweightSend';


/*
 * TODO: handle reconnection
 * TODO: handle multiple subscriptions to the same channel
 */
async function backendSubscribe(ws: WebSocket, name: string, payload: any, onData: Function) {

    //@ts-ignore
    window.backendSubscriptions = window.backendSubscriptions || [];
    //@ts-ignore
    window.backendSubscriptions.push({ name, payload });

    const data:any = await lightweightSend(ws, name, {
        subscribe: 1,
        ...payload
    });
    const reqId = data.req_id;
    const subscriptionId = data.subscription.id;

    onData(data);

    function receive(messageEvent: any) {
        const data = JSON.parse(messageEvent.data);

        if (data.req_id !== reqId) {
            return;
        }

        onData(data);
    }

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
        subscriptionId
    }
}


export default backendSubscribe;