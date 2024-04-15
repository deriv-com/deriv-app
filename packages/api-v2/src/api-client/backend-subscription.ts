import _ from 'lodash';
import lightweightSend from './send';

function generateRandomInteger() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1;
}

/**
 * Subscribes directly to backend stream
 * WARNING: it does not check for dubplicates, its just
 */
export default class BackendSubsription {
    ws: WebSocket;
    name: string;
    payload: any;

    reqId: number | null;
    subscriptionId: string | null;

    lastData: any;

    onData: Function;
    boundOnWsMessage: any;

    listeners: Function[];

    constructor(ws: WebSocket, name: string, payload: any, onData: Function) {
        this.ws = ws;
        this.name = name;
        this.payload = payload;

        this.reqId = null;
        this.subscriptionId = null;
    
        this.lastData = null;

        this.onData = onData;

        this.boundOnWsMessage = this.onWsMessage.bind(this);

        this.listeners = [];
    }

    async unsubscribe() {
        this.ws.removeEventListener('message', this.boundOnWsMessage);
        await lightweightSend(this.ws, generateRandomInteger(), 'forget', { forget: this.subscriptionId });
    }

    async subscribe() {
        this.ws.addEventListener('message', this.boundOnWsMessage)
        this.ws.addEventListener('close', () => {
            this.ws.removeEventListener('message', this.boundOnWsMessage);
        });

        const data:any = await lightweightSend(this.ws, generateRandomInteger(), this.name, {
            subscribe: 1,
            ...this.payload
        });
        
        this.lastData = data;
        
        this.onData(data);
    }

    addListener(onData: Function) {
        this.listeners.push(onData);
    }

    removeListener(onData: Function) {
        _.remove(this.listeners, onData);
    }

    onWsMessage(messageEvent: any) {
        const data = JSON.parse(messageEvent.data);

        if (data.req_id !== this.reqId) {
            return;
        }

        this.lastData = data;
        this.onData(data);
    }
}
