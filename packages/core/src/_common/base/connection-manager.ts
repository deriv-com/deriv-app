// @ts-expect-error TypeScript update for Deriv API
import DerivAPI from '@deriv/deriv-api/dist/DerivAPIBasic';
import {
    getActiveLoginID,
    getAppId,
    getSocketURL,
    websocket_servers,
    State,
    cloneObject,
    getPropertyValue,
} from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { TClientStore } from '@deriv/stores/types';
import APIMiddleware from './api_middleware';
import SocketCache from './socket_cache';
import type { ConnectionConfig, ConnectionInstance, DerivAPIBasic, DerivAPIConstructorArgs } from './socket.types';

export class ConnectionManager {
    client_store?: TClientStore;
    connections: ConnectionInstance[];
    active_connection?: ConnectionInstance;
    has_connected_before: boolean;
    is_switching_socket: boolean;
    is_disconnect_called: boolean;
    invalid_app_id: number | string;
    synchronize: (active_connection: ConnectionInstance) => void;
    config: ConnectionConfig = {};

    constructor({ synchronize }: DerivAPIConstructorArgs) {
        this.synchronize = synchronize;
        this.invalid_app_id = 0;
        this.is_switching_socket = false;
        this.is_disconnect_called = false;
        this.has_connected_before = false;
        const language = getLanguage();
        this.connections = Object.keys(websocket_servers).map(env => {
            return this.createConnectionInstance({
                id: env,
                url: websocket_servers[env as keyof typeof websocket_servers],
                language,
            });
        });

        const endpoint_url = window.localStorage.getItem('config.server_url');
        if (endpoint_url) {
            const instance = this.createConnectionInstance({ id: 'endpoint', url: endpoint_url, language });
            this.connections.push(instance);
            this.active_connection = instance;
            this.attachEventHandlers(instance.deriv_api);
            return;
        }

        const matching_connection = this.getActiveConnection();
        this.active_connection = matching_connection;
        if (this.active_connection) {
            this.synchronize(this.active_connection);
        }
    }

    setClientStore(client_store: TClientStore) {
        this.client_store = client_store;
    }

    setConfig(config: ConnectionConfig) {
        this.config = config;
    }

    wait(...responses: string[]) {
        this.active_connection?.deriv_api.expectResponse(
            responses.filter(r => !(r === 'authorize' && !this.client_store?.is_logged_in))
        );
    }

    hasReadyState(...states: number[]) {
        return (
            this.active_connection?.connection && states.some(s => this.active_connection?.connection.readyState === s)
        );
    }

    isClosed() {
        return !this.active_connection?.connection || this.hasReadyState(2, 3);
    }

    isReady() {
        return this.hasReadyState(1);
    }

    createConnectionInstance({
        id,
        url = '',
        language,
    }: {
        id: string;
        url?: string;
        language: string;
    }): ConnectionInstance {
        const connection = new WebSocket(getSocketURL({ url, language }));
        return {
            id,
            connection,
            deriv_api: new DerivAPI({
                connection,
                storage: SocketCache,
                middleware: new APIMiddleware(this.config),
            }),
        };
    }

    closeWebSocketValidation(): boolean {
        if (this.invalid_app_id === getAppId()) return false;
        if (!this.is_switching_socket && typeof this.config.wsEvent === 'function') {
            this.config.wsEvent('init');
        }
        if (!this.isClosed()) return false;
        return true;
    }

    getActiveConnection() {
        const active_loginid = getActiveLoginID();
        const matching_connection = this.connections.find(
            c => c.id === (active_loginid && !/VRTC|VRW/.test(active_loginid) ? 'real' : 'demo')
        );
        return matching_connection;
    }

    handleLoginIDChange() {
        if (window.localStorage.getItem('config.server_url')) return;
        const matching_connection = this.getActiveConnection();
        this.active_connection = matching_connection;

        if (this.active_connection?.deriv_api) {
            this.attachEventHandlers(this.active_connection?.deriv_api);
        }
    }

    handleLanguageChange(new_language: string) {
        if (this.active_connection) {
            this.active_connection.connection.close();
            this.is_switching_socket = true;

            if (!this.closeWebSocketValidation()) return;

            const new_instance = this.createConnectionInstance({
                id: this.active_connection.id,
                url: getSocketURL({ language: new_language }),
                language: new_language,
            });
            this.active_connection = new_instance;
            if (this.active_connection?.deriv_api) {
                this.attachEventHandlers(this.active_connection?.deriv_api);
            }
        }
    }

    attachEventHandlers(deriv_api: DerivAPIBasic) {
        if (typeof deriv_api.onOpen === 'function') {
            deriv_api.onOpen().subscribe(() => {
                this.is_disconnect_called = false;

                if (typeof this.config.wsEvent === 'function') {
                    this.config.wsEvent('open');
                }

                this.wait('website_status');

                if (this.client_store?.is_logged_in) {
                    const authorize_token = this.client_store.getToken();
                    deriv_api.authorize(authorize_token);
                }

                if (typeof this.config.onOpen === 'function') {
                    this.config.onOpen();
                }

                if (typeof this.config.onReconnect === 'function' && this.has_connected_before) {
                    this.config.onReconnect();
                }

                if (!this.has_connected_before) {
                    this.has_connected_before = true;
                }
            });
        }

        if (typeof deriv_api.onMessage === 'function') {
            deriv_api.onMessage().subscribe(({ data: response }) => {
                const msg_type = response.msg_type;
                State.set(['response', msg_type], cloneObject(response));

                if (typeof this.config.wsEvent === 'function') {
                    this.config.wsEvent('message');
                }

                if (getPropertyValue(response, ['error', 'code']) === 'InvalidAppID') {
                    this.invalid_app_id = getAppId();
                }

                if (typeof this.config.onMessage === 'function') {
                    this.config.onMessage(response);
                }
            });
        }

        if (typeof deriv_api.onClose === 'function') {
            deriv_api.onClose().subscribe(() => {
                if (!this.is_switching_socket && typeof this.config.wsEvent === 'function') {
                    this.config.wsEvent('close');
                } else {
                    this.is_switching_socket = false;
                }

                if (
                    this.invalid_app_id !== getAppId() &&
                    typeof this.config.onDisconnect === 'function' &&
                    !this.is_disconnect_called
                ) {
                    this.config.onDisconnect();
                    this.is_disconnect_called = true;
                }
            });
        }

        if (this.active_connection) {
            this.synchronize(this.active_connection);
        }
    }
}
