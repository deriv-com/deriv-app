// @ts-expect-error TypeScript update for Deriv API
import DerivAPI from '@deriv/deriv-api/dist/DerivAPIBasic';
import {
    getAppId,
    getSocketURL,
    websocket_servers,
    State,
    cloneObject,
    getPropertyValue,
    getActiveLoginIDType,
    getActiveLoginID,
} from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { TClientStore } from '@deriv/stores/types';
import APIMiddleware from './api_middleware';
import SocketCache from './socket_cache';
import type { ConnectionConfig, ConnectionInstance, DerivAPIConstructorArgs, GenericResponse } from './socket.types';

/**
 * Manages WebSocket connections and provides methods for handling various caveats
 * of Deriv WS API.
 *
 * @class
 */
export class ConnectionManager {
    client_store?: TClientStore;
    connections: ConnectionInstance[] = [];
    active_connection?: ConnectionInstance;
    has_connected_before: boolean;
    is_switching_socket: boolean;
    is_disconnect_called: boolean;
    invalid_app_id: number | string;
    onChangeActiveConnection: (active_connection: ConnectionInstance) => void;
    config: ConnectionConfig;

    /**
     * Feature toggling constant
     * `default` - only 2 connections are maintained (real/demo env)
     * `loginid` - will maintain connections equivalent to how many loginid the user has
     */
    mode: 'loginid' | 'default' = 'loginid';

    /**
     * Constructs a new ConnectionManager instance.
     *
     * @constructor
     * @param {Object} params - The configuration and dependencies for the ConnectionManager.
     * @param {Function} params.onChangeActiveConnection - A callback function to handle active connection changes.
     * @param {ConnectionConfig} params.config - Configuration options for WebSocket connections.
     * @param {TClientStore} params.client_store - The client store used for authentication and authorization.
     */
    constructor({ onChangeActiveConnection, config, client_store }: DerivAPIConstructorArgs) {
        this.config = config;
        this.client_store = client_store;
        this.onChangeActiveConnection = onChangeActiveConnection;
        this.invalid_app_id = 0;
        this.is_switching_socket = false;
        this.is_disconnect_called = false;
        this.has_connected_before = false;
        this.initializeConnections();
    }

    /**
     * Initializes WebSocket connections based on application configuration and user settings.
     *
     * This method sets up WebSocket connections based on the application's configuration and user preferences.
     * It initializes connections to real and demo WebSocket endpoints and handles switching between them.
     * The method also attaches event handlers and triggers appropriate callbacks upon initialization.
     *
     * @async
     * @method
     * @memberof ConnectionManager
     * @throws {Error} Throws an error if any connection initialization fails.
     * @returns {Promise<void>} A promise that resolves when WebSocket connections are successfully initialized.
     */
    async initializeConnections() {
        const language = getLanguage();

        // Initialize a connection for the development environment if config.server_url is set
        const endpoint_url = window.localStorage.getItem('config.server_url');
        if (endpoint_url) {
            const instance = this.createConnectionInstance({ id: 'development', url: endpoint_url, language });
            this.connections.push(instance);
            this.active_connection = instance;
            this.attachEventHandlers();
            if (this.active_connection) {
                this.onChangeActiveConnection(this.active_connection);
                if (typeof this.config.wsEvent === 'function') {
                    this.config.wsEvent('init');
                }
            }
        } else {
            // Initialize only 2 connections - real & demo if predefined mode flag is set to `default`
            if (this.mode === 'default') {
                this.connections = Object.keys(websocket_servers).map(env => {
                    return this.createConnectionInstance({
                        id: env,
                        url: websocket_servers[env as keyof typeof websocket_servers],
                        language,
                    });
                });
            } else {
                // Initialize connections based on user loginids (1 for each) and perform authorize on connect
                const account_list = localStorage.getItem('client.accounts');
                if (account_list) {
                    const parsed_account_list = JSON.parse(account_list);
                    const account_ids = Object.keys(parsed_account_list as string[]);
                    this.connections = account_ids.map(id => {
                        const instance = this.createConnectionInstance({
                            id,
                            url: websocket_servers[
                                (/VRTC|VRW/.test(id) ? 'demo' : 'real') as keyof typeof websocket_servers
                            ],
                            language,
                        });

                        const token = parsed_account_list[id]?.token;
                        if (token) {
                            instance.deriv_api.authorize(token);
                        }
                        return instance;
                    });
                }
            }

            const matching_connection = this.getActiveConnection();
            this.active_connection = matching_connection;
            this.attachEventHandlers();
            if (this.active_connection) {
                this.onChangeActiveConnection(this.active_connection);
                if (typeof this.config.wsEvent === 'function') {
                    this.config.wsEvent('init');
                }
            }
        }
    }

    /**
     * Asynchronously waits for specific WebSocket responses to be resolved.
     *
     * @async
     * @param {...string} responses - An array of response types to wait for.
     * @throws {Error} Throws an error if any of the specified responses are not received.
     * @returns {Promise<void>} A promise that resolves when all specified responses are received.
     */
    async wait(...responses: string[]) {
        return this.active_connection?.deriv_api.expectResponse(
            // @ts-expect-error Deriv API implementation
            ...responses.filter(type => !(type === 'authorize' && !this.client_store?.is_logged_in))
        );
    }

    /**
     * Subscribes to a specific WebSocket request and specifies a callback function to handle the response.
     *
     * This method subscribes to a WebSocket request using the active connection's `deriv_api` instance.
     * It specifies a callback function to handle the response data when the WebSocket server sends a response.
     *
     * @method
     * @memberof ConnectionManager
     * @param {Record<string, unknown>} request - The WebSocket request to subscribe to.
     * @param {(args: unknown) => unknown} cb - A callback function to process the response data.
     * @returns {unknown} An unknown value returned by the subscription, which can typically be used for cleanup.
     */
    subscribe(request: Record<string, unknown>, cb: (args: unknown) => unknown) {
        return this.active_connection?.deriv_api.subscribe(request).subscribe(cb, cb);
    }

    /**
     * Checks if the WebSocket connection is in one of the specified ready states.
     *
     * @param {...number} states - An array of WebSocket ready states to check.
     * @returns {boolean} True if the connection is in one of the specified ready states, false otherwise.
     */
    hasReadyState(...states: number[]) {
        return (
            this.active_connection?.connection && states.some(s => this.active_connection?.connection.readyState === s)
        );
    }

    /**
     * Checks if the WebSocket connection is closed or in one of the closing states.
     *
     * @returns {boolean} True if the connection is closed or in a closing state, false otherwise.
     */
    isClosed() {
        return !this.active_connection?.connection || this.hasReadyState(2, 3);
    }

    /**
     * Checks if the WebSocket connection is in the open state.
     *
     * @returns {boolean} True if the connection is in the open state, false otherwise.
     */
    isReady() {
        return this.hasReadyState(1);
    }

    /**
     * Creates a WebSocket connection instance for a given ID, URL, and language.
     *
     * @param {Object} params - The parameters for creating the connection instance.
     * @param {string} params.id - The unique identifier for the connection.
     * @param {string} [params.url=''] - The WebSocket URL (optional, default is an empty string).
     * @param {string} params.language - The language for the connection.
     * @returns {ConnectionInstance} A connection instance containing the WebSocket connection and related objects.
     */
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

    /**
     * Retrieves the active connection based on the active login ID.
     *
     * @returns {ConnectionInstance|null} The active connection instance, or null if not found.
     */
    getActiveConnection() {
        const endpoint_url = window.localStorage.getItem('config.server_url');
        if (this.mode === 'loginid' && !endpoint_url) {
            return this.connections.find(c => c.id === getActiveLoginID());
        }
        return this.connections.find(c => {
            return c.id === (endpoint_url ? 'development' : getActiveLoginIDType());
        });
    }

    /**
     * Handles the change of login ID by switching connections instead of re-initializing,
     * and notifies listeners of the change.
     *
     * @returns {void}
     */
    handleLoginIDChange() {
        if (window.localStorage.getItem('config.server_url')) return;
        this.detachEventHandlers();
        const matching_connection = this.getActiveConnection();
        if (matching_connection && this.active_connection?.id !== matching_connection.id) {
            if (typeof this.config.wsEvent === 'function') {
                this.config.wsEvent('init');
            }
            this.active_connection = matching_connection;
            this.attachEventHandlers();
            this.onChangeActiveConnection(matching_connection);
            if (typeof this.config.wsEvent === 'function') {
                this.config.wsEvent('open');
            }

            this.wait('website_status');

            if (this.client_store?.is_logged_in) {
                const authorize_token = this.client_store.getToken();
                this.active_connection?.deriv_api.authorize(authorize_token);
            }

            if (typeof this.config.onOpen === 'function') {
                this.config.onOpen(this.hasReadyState(1));
            }
        }
    }

    /**
     * Handles switching the language for the WebSocket connection.
     *
     * Note: Due to limitations in the WebSocket API, this function closes the current connection
     * and creates a new connection with the specified language.
     *
     * @param {string} new_language - The ISO 2 letter language code for the new language.
     * @returns {void}
     */
    handleLanguageChange(new_language: string) {
        if (this.active_connection) {
            this.active_connection.connection.close();
            this.is_switching_socket = true;

            if (this.invalid_app_id === getAppId()) return false;
            if (!this.is_switching_socket && typeof this.config.wsEvent === 'function') {
                this.config.wsEvent('init');
            }
            if (!this.isClosed()) return false;

            const new_instance = this.createConnectionInstance({
                id: this.active_connection.id,
                url: getSocketURL({ language: new_language }),
                language: new_language,
            });
            this.active_connection = new_instance;
            this.attachEventHandlers();
        }
    }

    /**
     * Attaches WebSocket event handlers to the active connection instance.
     *
     * This function sets up event handlers for WebSocket events such as open, message, and close.
     * It also performs various actions based on these events and configuration settings.
     *
     * @returns {void}
     */
    attachEventHandlers() {
        if (
            !this.active_connection?.deriv_api ||
            typeof this.active_connection?.deriv_api.onClose !== 'function' ||
            typeof this.active_connection?.deriv_api.onOpen !== 'function' ||
            typeof this.active_connection?.deriv_api.onMessage !== 'function'
        )
            return;

        this.active_connection.deriv_api.onOpen().subscribe(this.onOpenHandler);
        this.active_connection.deriv_api.onMessage().subscribe(this.onMessageHandler);
        this.active_connection.deriv_api.onClose().subscribe(this.onCloseHandler);
    }

    /**
     * Event handler for WebSocket 'open' event.
     *
     * This function is called when the WebSocket connection is successfully opened.
     * It performs various actions such as notifying about the connection status, waiting for 'website_status'
     * response, sending the authorize call if the client is logged in, and handling reconnect events.
     *
     * @callback onOpenHandler
     * @memberof ConnectionManager
     * @returns {void}
     */
    onOpenHandler = () => {
        this.is_disconnect_called = false;

        if (typeof this.config.wsEvent === 'function') {
            this.config.wsEvent('open');
        }

        this.wait('website_status');

        if (this.client_store?.is_logged_in) {
            const authorize_token = this.client_store.getToken();
            this.active_connection?.deriv_api.authorize(authorize_token);
        }

        if (typeof this.config.onOpen === 'function') {
            this.config.onOpen(this.hasReadyState(1));
        }

        if (typeof this.config.onReconnect === 'function' && this.has_connected_before) {
            this.config.onReconnect();
        }

        if (!this.has_connected_before) {
            this.has_connected_before = true;
        }
    };

    /**
     * Event handler for WebSocket 'message' event.
     *
     * This function is called when a message is received over the WebSocket connection.
     * It processes the received message, sets it in the application state, and triggers
     * appropriate callbacks if defined.
     *
     * @callback onMessageHandler
     * @memberof ConnectionManager
     * @param {GenericResponse} response - The WebSocket message response.
     * @returns {void}
     */
    onMessageHandler = ({ data: response }: GenericResponse) => {
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
    };

    /**
     * Event handler for WebSocket 'close' event.
     *
     * This function is called when the WebSocket connection is closed.
     * It handles WebSocket connection close events, including notifying about the close event,
     * managing the 'is_switching_socket' flag, and executing the 'onDisconnect' callback if defined.
     *
     * @callback onCloseHandler
     * @memberof ConnectionManager
     * @returns {void}
     */
    onCloseHandler = () => {
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
    };

    /**
     * Detaches WebSocket event handlers from the active connection instance.
     *
     * This function removes the event handlers previously attached to the WebSocket connection.
     * It unsubscribes from the 'open', 'message', and 'close' events to prevent memory leaks and unwanted
     * event processing.
     *
     * @returns {void}
     */
    detachEventHandlers() {
        if (
            !this.active_connection?.deriv_api ||
            typeof this.active_connection?.deriv_api.onClose !== 'function' ||
            typeof this.active_connection?.deriv_api.onOpen !== 'function' ||
            typeof this.active_connection?.deriv_api.onMessage !== 'function'
        )
            return;

        this.active_connection.deriv_api.onOpen().unsubscribe();
        this.active_connection.deriv_api.onMessage().unsubscribe();
        this.active_connection.deriv_api.onClose().unsubscribe();
    }
}
