
import SubscriptionsManager from "./subscriptions-manager";
import request from "./request";

/**
 * really have doubts about the sense of existence of this class
 */
export default class WSClient {
    ws: WebSocket;
    subscriptionManager: SubscriptionsManager | undefined;

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.subscriptionManager = new SubscriptionsManager(ws);
    }

    request(name: string, payload: object) {
       return request(this.ws, name, payload);
    }

    subscribe(name: string, payload: object, onData: Function) {
        return this.subscriptionManager?.subscribe(name, payload, onData);
    }
}