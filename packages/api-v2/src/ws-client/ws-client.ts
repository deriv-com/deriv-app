import {
    TSocketEndpointNames,
    TSocketRequestPayload,
    TSocketResponse,
    TSocketSubscribableEndpointNames,
} from '../../types';

import request from './request';
import SubscriptionsManager from './subscriptions-manager';

/**
 * WSClient as main instance
 */
export default class WSClient {
    ws?: WebSocket;
    subscriptionManager: SubscriptionsManager;
    isAuthorized = false;
    onAuthorized?: () => void;
    endpoint?: string;

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

    setEndpoint(endpoint: string) {
        this.endpoint = endpoint;
    }

    private onWebsocketAuthorized() {
        if (!this.ws) {
            return;
        }

        this.isAuthorized = true;
        this.onAuthorized?.();

        this.subscriptionManager.setAuthorizedWs(this.ws);
    }

    async request<T extends TSocketEndpointNames>(
        name: TSocketEndpointNames,
        payload?: TSocketRequestPayload<T>['payload']
    ): Promise<TSocketResponse<T>> {
        if (!this.ws) {
            return Promise.reject(new Error('WS is not set'));
        }
        return request(this.ws, name, payload).then((response: TSocketResponse<TSocketEndpointNames>) => {
            if ('msg_type' in response && response.msg_type === 'authorize') {
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

    async close() {
        await this.subscriptionManager.close();
        this.ws?.close();
    }
}
