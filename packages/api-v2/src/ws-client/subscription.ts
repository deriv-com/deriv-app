import _ from 'lodash';
import send from './request';

/**
 * Subscribes directly to backend stream
 * WARNING: it does not check for dubplicates, its just
 */
export default class BackendSubscription {
    ws: WebSocket;
    name: string;
    payload: any;

    reqId: number | null;
    subscriptionId: string | null;

    lastData: any;

    boundOnWsMessage: any;
    boundOnWsClose: any;

    listeners: Function[];

    constructor(ws: WebSocket, name: string, payload: any) {
        this.ws = ws;
        this.name = name;
        this.payload = payload;

        this.reqId = null;
        this.subscriptionId = null;
    
        this.lastData = null;

        this.boundOnWsMessage = this.onWsMessage.bind(this);
        this.boundOnWsClose = this.onWsClose.bind(this);

        this.listeners = [];
    }

    async unsubscribe() {
        this.ws.removeEventListener('message', this.boundOnWsMessage);
        this.ws.removeEventListener('close', this.boundOnWsClose);
        await send(this.ws, 'forget', { forget: this.subscriptionId });
    }

    async onWsClose() {
        this.ws.removeEventListener('message', this.boundOnWsMessage);
        this.ws.removeEventListener('close', this.boundOnWsClose);
    }

    async subscribe() {
        this.ws.addEventListener('message', this.boundOnWsMessage)
        this.ws.addEventListener('close', this.boundOnWsClose);

        const data:any = await send(this.ws, this.name, {
            subscribe: 1,
            ...this.payload
        });

        this.subscriptionId = data.subscription.id;
        this.reqId = data.req_id;
        this.lastData = data;
        
        this.listeners.forEach(listener => listener(data));
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
        this.listeners.forEach(listener => listener(data));
    }
}
