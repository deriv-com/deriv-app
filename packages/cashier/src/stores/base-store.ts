import { action, when, makeObservable } from 'mobx';
import { isProduction } from '@deriv/shared';
import { TRootStore } from '../types';

type TListenerResponse = {
    then: (func: VoidFunction) => void;
};

type TBaseStoreOptions = {
    root_store?: TRootStore;
};

/**
 * BaseStore class is the base class for all defined stores in the application. It handles some stuff such as:
 *  1. Creating snapshot object from the store.
 *  2. Saving the store's snapshot in local/session storage and keeping them in sync.
 */
export default class BaseStore {
    /**
     * An enum object to define LOCAL_STORAGE and SESSION_STORAGE
     */
    static STORAGES = Object.freeze({
        LOCAL_STORAGE: Symbol('LOCAL_STORAGE'),
        SESSION_STORAGE: Symbol('SESSION_STORAGE'),
    });

    client_init_listener: null | (() => TListenerResponse) = null;
    clientInitDisposer: null | (() => void) = null;
    root_store?: TRootStore;
    switch_account_listener: null | (() => TListenerResponse) = null;
    switchAccountDisposer: null | (() => void) = null;

    /**
     * Constructor of the base class that gets properties' name of child which should be saved in storages
     *
     * @param {Object} options - An object that contains the following properties:
     *     @property {Object}   root_store - An object that contains the root store of the app.
     *     @property {String[]} local_storage_properties - A list of properties' names that should be kept in localStorage.
     *     @property {String[]} session_storage_properties - A list of properties' names that should be kept in sessionStorage.
     *     @property {Object}   validation_rules - An object that contains the validation rules for each property of the store.
     *     @property {String}   store_name - Explicit store name for browser application storage (to bypass minification)
     */
    constructor(options: TBaseStoreOptions = {}) {
        makeObservable(this, {
            onSwitchAccount: action.bound,
            onClientInit: action.bound,
            disposeSwitchAccount: action.bound,
            onUnmount: action.bound,
        });

        const { root_store } = options;
        this.root_store = root_store;
    }

    onSwitchAccount(listener: null | (() => TListenerResponse)): void {
        if (listener) {
            this.switch_account_listener = listener;

            this.switchAccountDisposer = when(
                () => !!this.root_store?.client.switch_broadcast,
                () => {
                    try {
                        const result = this.switch_account_listener?.();
                        if (result?.then && typeof result.then === 'function') {
                            result.then(() => {
                                this.root_store?.client.switchEndSignal?.();
                                this.onSwitchAccount(this.switch_account_listener);
                            });
                        } else {
                            throw new Error('Switching account listeners are required to return a promise.');
                        }
                    } catch (error) {
                        // there is no listener currently active. so we can just ignore the error raised from treating
                        // a null object as a function. Although, in development mode, we throw a console error.
                        if (!isProduction()) {
                            console.error(error); // eslint-disable-line
                        }
                    }
                }
            );
        }
    }

    onClientInit(listener: null | (() => TListenerResponse)): void {
        this.clientInitDisposer = when(
            () => !!this.root_store?.client.initialized_broadcast,
            async () => {
                try {
                    const result = this.client_init_listener?.();
                    if (result?.then && typeof result.then === 'function') {
                        result.then(() => {
                            this.root_store?.client.setInitialized(false);
                            this.onClientInit(this.client_init_listener);
                        });
                    } else {
                        throw new Error('Client init listeners are required to return a promise.');
                    }
                } catch (error) {
                    // there is no listener currently active. so we can just ignore the error raised from treating
                    // a null object as a function. Although, in development mode, we throw a console error.
                    if (!isProduction()) {
                        console.error(error); // eslint-disable-line
                    }
                }
            }
        );
        this.client_init_listener = listener;
    }

    disposeSwitchAccount() {
        if (typeof this.switchAccountDisposer === 'function') {
            this.switchAccountDisposer();
        }
        this.switch_account_listener = null;
    }

    onUnmount() {
        this.disposeSwitchAccount();
    }
}
