import { action, intercept, observable, reaction, toJS, when } from 'mobx';
import { isProduction, isEmptyObject } from '@deriv/shared';
import Validator from 'Utils/validator/validator';
import { TRootStore } from 'Types';

type TBaseStoreOptions = {
    root_store?: TRootStore;
    local_storage_properties?: Array<string>;
    session_storage_properties?: Array<string>;
    validation_rules?: any;
    store_name?: string;
};

type TListenerResponse = {
    then: (func: () => void) => void;
};

type TValidationRules = { [key: string]: Array<string> | string } & {
    [key: string]: {
        trigger?: PropertyKey;
        rules?: Array<string> | string;
    };
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

    @observable
    validation_errors: { [key: string]: Array<string> } = {};

    @observable
    validation_rules: TValidationRules = {};

    root_store?: TRootStore;
    local_storage_properties?: Array<string>;
    session_storage_properties?: Array<string>;

    preSwitchAccountDisposer: null | (() => void) = null;
    pre_switch_account_listener: null | (() => TListenerResponse) = null;

    switchAccountDisposer: null | (() => void) = null;
    switch_account_listener: null | (() => TListenerResponse) = null;

    logoutDisposer: null | (() => void) = null;
    logout_listener: null | (() => TListenerResponse) = null;

    clientInitDisposer: null | (() => void) = null;
    client_init_listener: null | (() => TListenerResponse) = null;

    networkStatusChangeDisposer: null | (() => void) = null;
    network_status_change_listener: null | ((is_online?: boolean) => TListenerResponse) = null;

    themeChangeDisposer: null | (() => void) = null;
    theme_change_listener: null | ((is_dark_mode_on?: boolean) => TListenerResponse) = null;

    realAccountSignupEndedDisposer: null | (() => void) = null;
    real_account_signup_ended_listener: null | (() => TListenerResponse) = null;

    store_name = '';

    @observable partial_fetch_time = 0;

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
        const { root_store, local_storage_properties, session_storage_properties, validation_rules, store_name } =
            options;

        Object.defineProperty(this, 'root_store', {
            enumerable: false,
            writable: true,
        });
        Object.defineProperty(this, 'local_storage_properties', {
            enumerable: false,
            writable: true,
        });
        Object.defineProperty(this, 'session_storage_properties', {
            enumerable: false,
            writable: true,
        });

        const has_local_or_session_storage =
            (local_storage_properties && local_storage_properties.length) ||
            (session_storage_properties && session_storage_properties.length);

        if (has_local_or_session_storage) {
            if (!store_name) {
                throw new Error('store_name is required for local/session storage');
            }

            Object.defineProperty(this, 'store_name', {
                value: store_name,
                enumerable: false,
                writable: false,
            });
        }

        this.root_store = root_store;
        this.local_storage_properties = local_storage_properties || [];
        this.session_storage_properties = session_storage_properties || [];
        this.setValidationRules(validation_rules);

        this.setupReactionForLocalStorage();
        this.setupReactionForSessionStorage();
        this.retrieveFromStorage();
    }

    /**
     * Returns an snapshot of the current store
     *
     * @param {String[]} properties - A list of properties' names that should be in the snapshot.
     *
     * @return {Object} Returns a cloned object of the store.
     */
    getSnapshot(properties: Array<string>): object {
        let snapshot = toJS(this);

        if (!isEmptyObject(this.root_store)) {
            snapshot.root_store = this.root_store;
        }

        if (properties && properties.length) {
            snapshot = properties.reduce(
                (result, p) => Object.assign(result, { [p]: snapshot[p as keyof this] }),
                this
            );
        }

        return snapshot;
    }

    /**
     * Sets up a reaction on properties which are mentioned in `local_storage_properties`
     *  and invokes `saveToStorage` when there are any changes on them.
     *
     */
    setupReactionForLocalStorage() {
        if (this.local_storage_properties?.length) {
            reaction(
                () => this.local_storage_properties?.map(i => this[i as keyof this]),
                () => this.saveToStorage(this.local_storage_properties, BaseStore.STORAGES.LOCAL_STORAGE)
            );
        }
    }

    /**
     * Sets up a reaction on properties which are mentioned in `session_storage_properties`
     *  and invokes `saveToStorage` when there are any changes on them.
     *
     */
    setupReactionForSessionStorage() {
        if (this.session_storage_properties?.length) {
            reaction(
                () => this.session_storage_properties?.map(i => this[i as keyof this]),
                () => this.saveToStorage(this.session_storage_properties, BaseStore.STORAGES.SESSION_STORAGE)
            );
        }
    }

    /**
     * Removes properties that are not passed from the snapshot of the store and saves it to the passed storage
     *
     * @param {String[]} properties - A list of the store's properties' names which should be saved in the storage.
     * @param {Symbol}   storage    - A symbol object that defines the storage which the snapshot should be stored in it.
     *
     */
    saveToStorage(properties: Array<string> = [], storage: symbol) {
        const snapshot = JSON.stringify(this.getSnapshot(properties), (key, value) => {
            if (value !== null) return value;
            return undefined;
        });

        if (storage === BaseStore.STORAGES.LOCAL_STORAGE) {
            localStorage.setItem(this.store_name, snapshot);
        } else if (storage === BaseStore.STORAGES.SESSION_STORAGE) {
            sessionStorage.setItem(this.store_name, snapshot);
        }
    }

    /**
     * Retrieves saved snapshot of the store and assigns to the current instance.
     *
     */
    @action
    retrieveFromStorage(): void {
        const local_storage_snapshot = JSON.parse(String(localStorage.getItem(this.store_name)));
        const session_storage_snapshot = JSON.parse(String(sessionStorage.getItem(this.store_name)));

        const snapshot = { ...local_storage_snapshot, ...session_storage_snapshot };

        Object.keys(snapshot).forEach(k => (this[k as keyof this] = snapshot[k]));
    }

    /**
     * Sets validation error messages for an observable property of the store
     *
     * @param {String} propertyName - The observable property's name
     * @param [{String}] messages - An array of strings that contains validation error messages for the particular property.
     *
     */
    @action
    setValidationErrorMessages(propertyName: string, messages: Array<string>) {
        const is_different = () =>
            !!this.validation_errors[propertyName as keyof typeof this.validation_errors]
                .filter((x: string) => !messages.includes(x))
                .concat(
                    messages.filter(
                        x => !this.validation_errors[propertyName as keyof typeof this.validation_errors].includes(x)
                    )
                ).length;
        if (!this.validation_errors[propertyName as keyof typeof this.validation_errors] || is_different()) {
            this.validation_errors[propertyName as keyof typeof this.validation_errors] = messages;
        }
    }

    /**
     * Sets validation rules
     *
     * @param {object} rules
     *
     */
    @action
    setValidationRules(rules = {}): void {
        Object.keys(rules).forEach(key => {
            this.addRule(key, rules[key as keyof typeof this.addRule]);
        });
    }

    /**
     * Adds rules to the particular property
     *
     * @param {String} property
     * @param {String} rules
     *
     */
    @action
    addRule(property: string, rules: string) {
        this.validation_rules[property as keyof typeof this.validation_rules] = rules;

        intercept(this, property, change => {
            this.validateProperty(property, change.newValue);
            return change;
        });
    }

    /**
     * Validates a particular property of the store
     *
     * @param {String} property - The name of the property in the store
     * @param {object} value    - The value of the property, it can be undefined.
     *
     */
    @action
    validateProperty(property: string, value: unknown): void {
        const trigger = this.validation_rules[property as keyof typeof this.validation_rules].trigger;
        const inputs = { [property]: value !== undefined ? value : this[property as keyof this] };
        const rules = this.validation_rules[trigger as keyof typeof this.validation_rules].rules;
        const validation_rules = {
            [property]: this.validation_rules[property as keyof typeof this.validation_rules].rules || [],
        };

        if (!!trigger && Object.hasOwnProperty.call(this, trigger)) {
            inputs[trigger as string] = this[trigger as keyof this];
            validation_rules[trigger as string] = rules || [];
        }

        const validator = new Validator(inputs, validation_rules, this);

        validator.isPassed();

        Object.keys(inputs).forEach(key => {
            this.setValidationErrorMessages(key, validator.errors.get(key));
        });
    }

    /**
     * Validates all properties which validation rule has been set for.
     *
     */
    @action
    validateAllProperties(): void {
        const validation_rules = Object.keys(this.validation_rules);
        const validation_errors = Object.keys(this.validation_errors);

        validation_rules.forEach(p => {
            this.validateProperty(p, this[p as keyof typeof this.validateProperty]);
        });

        // Remove keys that are present in error, but not in rules:
        validation_errors.forEach(error => {
            if (!validation_rules.includes(error)) {
                delete this.validation_errors[error as keyof typeof this.validation_errors];
            }
        });
    }

    @action.bound
    onSwitchAccount(listener: null | (() => TListenerResponse)): void {
        if (listener) {
            this.switch_account_listener = listener;

            this.switchAccountDisposer = when(
                () => this.root_store?.client.switch_broadcast || false,
                () => {
                    try {
                        const result = this.switch_account_listener?.();
                        if (result && result.then && typeof result.then === 'function') {
                            result.then(() => {
                                this.root_store?.client.switchEndSignal();
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

    @action.bound
    onPreSwitchAccount(listener: null | (() => TListenerResponse)): void {
        if (listener) {
            this.pre_switch_account_listener = listener;
            this.preSwitchAccountDisposer = when(
                () => this.root_store?.client.pre_switch_broadcast || false,
                () => {
                    try {
                        const result = this.pre_switch_account_listener?.();
                        if (result && result.then && typeof result.then === 'function') {
                            result.then(() => {
                                this.root_store?.client.setPreSwitchAccount(false);
                                this.onPreSwitchAccount(this.pre_switch_account_listener);
                            });
                        } else {
                            throw new Error('Pre-switch account listeners are required to return a promise.');
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

    @action.bound
    onLogout(listener: null | (() => TListenerResponse)): void {
        this.logoutDisposer = when(
            () => this.root_store?.client.has_logged_out || false,
            async () => {
                try {
                    const result = this.logout_listener?.();
                    if (result && result.then && typeof result.then === 'function') {
                        result.then(() => {
                            this.root_store?.client.setLogout(false);
                            this.onLogout(this.logout_listener);
                        });
                    } else {
                        throw new Error('Logout listeners are required to return a promise.');
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
        this.logout_listener = listener;
    }

    @action.bound
    onClientInit(listener: null | (() => TListenerResponse)): void {
        this.clientInitDisposer = when(
            () => this.root_store?.client.initialized_broadcast || false,
            async () => {
                try {
                    const result = this.client_init_listener?.();
                    if (result && result.then && typeof result.then === 'function') {
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

    @action.bound
    onNetworkStatusChange(listener: null | (() => TListenerResponse)): void {
        this.networkStatusChangeDisposer = reaction(
            () => this.root_store?.common.is_network_online,
            is_online => {
                try {
                    this.network_status_change_listener?.(is_online);
                } catch (error) {
                    // there is no listener currently active. so we can just ignore the error raised from treating
                    // a null object as a function. Although, in development mode, we throw a console error.
                    if (!isProduction()) {
                        console.error(error); // eslint-disable-line
                    }
                }
            }
        );

        this.network_status_change_listener = listener;
    }

    @action.bound
    onThemeChange(listener: null | (() => TListenerResponse)): void {
        this.themeChangeDisposer = reaction(
            () => this.root_store?.ui.is_dark_mode_on,
            is_dark_mode_on => {
                try {
                    this.theme_change_listener?.(is_dark_mode_on);
                } catch (error) {
                    // there is no listener currently active. so we can just ignore the error raised from treating
                    // a null object as a function. Although, in development mode, we throw a console error.
                    if (!isProduction()) {
                        console.error(error); // eslint-disable-line
                    }
                }
            }
        );

        this.theme_change_listener = listener;
    }

    @action.bound
    onRealAccountSignupEnd(listener: null | (() => TListenerResponse)): void {
        this.realAccountSignupEndedDisposer = when(
            () => this.root_store?.ui.has_real_account_signup_ended || false,
            () => {
                try {
                    const result = this.real_account_signup_ended_listener?.();
                    if (result && result.then && typeof result.then === 'function') {
                        result.then(() => {
                            this.root_store?.ui.setRealAccountSignupEnd(false);
                            this.onRealAccountSignupEnd(this.real_account_signup_ended_listener);
                        });
                    } else {
                        throw new Error('Real account signup listeners are required to return a promise.');
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

        this.real_account_signup_ended_listener = listener;
    }

    @action.bound
    disposePreSwitchAccount(): void {
        if (typeof this.preSwitchAccountDisposer === 'function') {
            this.preSwitchAccountDisposer();
        }
        this.pre_switch_account_listener = null;
    }

    @action.bound
    disposeSwitchAccount(): void {
        if (typeof this.switchAccountDisposer === 'function') {
            this.switchAccountDisposer();
        }
        this.switch_account_listener = null;
    }

    @action.bound
    disposeLogout(): void {
        if (typeof this.logoutDisposer === 'function') {
            this.logoutDisposer();
        }
        this.logout_listener = null;
    }

    @action.bound
    disposeClientInit(): void {
        if (typeof this.clientInitDisposer === 'function') {
            this.clientInitDisposer();
        }
        this.client_init_listener = null;
    }

    @action.bound
    disposeNetworkStatusChange(): void {
        if (typeof this.networkStatusChangeDisposer === 'function') {
            this.networkStatusChangeDisposer();
        }
        this.network_status_change_listener = null;
    }

    @action.bound
    disposeThemeChange(): void {
        if (typeof this.themeChangeDisposer === 'function') {
            this.themeChangeDisposer();
        }
        this.theme_change_listener = null;
    }

    @action.bound
    disposeRealAccountSignupEnd(): void {
        if (typeof this.realAccountSignupEndedDisposer === 'function') {
            this.realAccountSignupEndedDisposer();
        }
        this.real_account_signup_ended_listener = null;
    }

    @action.bound
    onUnmount(): void {
        this.disposePreSwitchAccount();
        this.disposeSwitchAccount();
        this.disposeLogout();
        this.disposeClientInit();
        this.disposeNetworkStatusChange();
        this.disposeThemeChange();
        this.disposeRealAccountSignupEnd();
    }

    @action.bound
    assertHasValidCache(loginid: string, ...reactions: Array<() => void>): void {
        // account was changed when this was unmounted.
        if (this.root_store?.client.loginid !== loginid) {
            reactions.forEach(act => act());
            this.partial_fetch_time = 0;
        }
    }
}
