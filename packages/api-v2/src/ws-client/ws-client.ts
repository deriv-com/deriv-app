import SubscriptionsManager from './subscriptions-manager';
import request from './request';
import {
    TSocketResponse,
    TSocketRequestPayload,
    TSocketEndpointNames,
    TSocketSubscribableEndpointNames,
} from '../../types';

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

    request(name: TSocketEndpointNames, payload: TSocketRequestPayload<TSocketEndpointNames>['payload']) {
        return request(this.ws, name, payload);
    }

    subscribe(
        name: TSocketSubscribableEndpointNames,
        payload: TSocketRequestPayload<TSocketSubscribableEndpointNames>['payload'],
        onData: (data: TSocketResponse<TSocketSubscribableEndpointNames>) => void
    ) {
        return this.subscriptionManager?.subscribe(name, payload, onData);
    }
}
