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
    ws?: WebSocket;
    subscriptionManager: SubscriptionsManager;
    isAuthorized = false;
    onAuthorized?: () => void;

    constructor(onAuthorized?: () => void) {
        this.onAuthorized = onAuthorized;
        this.subscriptionManager = new SubscriptionsManager();
    }

    setWs(ws: WebSocket) {
        if (this.ws !== ws) {
            this.isAuthorized = false;
            this.ws = ws;
        }
    }

    private onWebsocketAuthorized() {
        if (!this.ws) {
            return;
        }

        this.isAuthorized = true;
        this.onAuthorized?.();

        this.subscriptionManager.setAuthorizedWs(this.ws);
    }

    request<T extends TSocketEndpointNames>(
        name: TSocketEndpointNames,
        payload?: TSocketRequestPayload<T>['payload']
    ): Promise<TSocketResponse<T>> {
        if (!this.ws) {
            return Promise.reject(new Error('No connection'));
        }
        return request(this.ws, name, payload).then((response: TSocketResponse<TSocketEndpointNames>) => {
            if ((response as unknown as any).msg_type === 'authorize') {
                this.onWebsocketAuthorized();
            }
            return response;
        });
    }

    subscribe(
        name: TSocketSubscribableEndpointNames,
        payload: TSocketRequestPayload<TSocketSubscribableEndpointNames>['payload'],
        onData: (data: TSocketResponse<TSocketSubscribableEndpointNames>) => void
    ) {
        return this.subscriptionManager?.subscribe(name, payload, onData);
    }
}
