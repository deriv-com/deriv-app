import { action, intercept, makeObservable, observable, reaction, toJS, when } from 'mobx';

import { isEmptyObject, isProduction, Validator } from '@deriv/shared';

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

    validation_errors = {};

    validation_rules = {};

    preSwitchAccountDisposer = null;
    pre_switch_account_listener = null;

    switchAccountDisposer = null;
    switch_account_listener = null;

    logoutDisposer = null;
    logout_listener = null;

    clientInitDisposer = null;
    client_init_listener = null;

    networkStatusChangeDisposer = null;
    network_status_change_listener = null;

    themeChangeDisposer = null;
    theme_change_listener = null;

    realAccountSignupEndedDisposer = null;
    real_account_signup_ended_listener = null;

    partial_fetch_time = 0;

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
    constructor(options = {}) {
        makeObservable(this, {
            validation_errors: observable,
            validation_rules: observable,
            partial_fetch_time: observable,
            retrieveFromStorage: action,
            setValidationErrorMessages: action,
            setValidationRules: action,
            addRule: action,
            validateProperty: action,
            validateAllProperties: action,
            onSwitchAccount: action.bound,
            onPreSwitchAccount: action.bound,
            onLogout: action.bound,
            onClientInit: action.bound,
            onNetworkStatusChange: action.bound,
            onThemeChange: action.bound,
            onRealAccountSignupEnd: action.bound,
            disposePreSwitchAccount: action.bound,
            disposeSwitchAccount: action.bound,
            disposeLogout: action.bound,
            disposeClientInit: action.bound,
            disposeNetworkStatusChange: action.bound,
            disposeThemeChange: action.bound,
            disposeRealAccountSignupEnd: action.bound,
            onUnmount: action.bound,
            assertHasValidCache: action.bound,
        });

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

        setTimeout(() => {
            this.setValidationRules(validation_rules);

            this.setupReactionForLocalStorage();
            this.setupReactionForSessionStorage();
            this.retrieveFromStorage();
        }, 0);
    }

    /**
     * Returns an snapshot of the current store
     *
     * @param {String[]} properties - A list of properties' names that should be in the snapshot.
     *
     * @return {Object} Returns a cloned object of the store.
     */
    getSnapshot(properties) {
        let snapshot = toJS(this);

        if (!isEmptyObject(this.root_store)) {
            snapshot.root_store = this.root_store;
        }

        if (properties && properties.length) {
            snapshot = properties.reduce((result, p) => Object.assign(result, { [p]: snapshot[p] }), {});
        }

        return snapshot;
    }

    /**
     * Sets up a reaction on properties which are mentioned in `local_storage_properties`
     *  and invokes `saveToStorage` when there are any changes on them.
     *
     */
    setupReactionForLocalStorage() {
        if (this.local_storage_properties.length) {
            reaction(
                () => this.local_storage_properties.map(i => this[i]),
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
        if (this.session_storage_properties.length) {
            reaction(
                () => this.session_storage_properties.map(i => this[i]),
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
    saveToStorage(properties, storage) {
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
    retrieveFromStorage() {
        const local_storage_snapshot = JSON.parse(localStorage.getItem(this.store_name, {}));
        const session_storage_snapshot = JSON.parse(sessionStorage.getItem(this.store_name, {}));

        const snapshot = { ...local_storage_snapshot, ...session_storage_snapshot };

        Object.keys(snapshot).forEach(k => (this[k] = snapshot[k]));
    }

    /**
     * Sets validation error messages for an observable property of the store
     *
     * @param {String} propertyName - The observable property's name
     * @param [{String}] messages - An array of strings that contains validation error messages for the particular property.
     *
     */
    setValidationErrorMessages(propertyName, messages) {
        const is_different = () =>
            !!this.validation_errors[propertyName]
                .filter(x => !messages.includes(x))
                .concat(messages.filter(x => !this.validation_errors[propertyName].includes(x))).length;
        if (!this.validation_errors[propertyName] || is_different()) {
            this.validation_errors[propertyName] = messages;
        }
    }

    /**
     * Sets validation rules
     *
     * @param {object} rules
     *
     */
    setValidationRules(rules = {}) {
        Object.keys(rules).forEach(key => {
            this.addRule(key, rules[key]);
        });
    }

    /**
     * Adds rules to the particular property
     *
     * @param {String} property
     * @param {String} rules
     *
     */
    addRule(property, rules) {
        this.validation_rules[property] = rules;

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
    validateProperty(property, value) {
        const trigger = this.validation_rules[property].trigger;
        const inputs = { [property]: value !== undefined ? value : this[property] };
        const validation_rules = { [property]: this.validation_rules[property].rules || [] };

        if (!!trigger && Object.hasOwnProperty.call(this, trigger)) {
            inputs[trigger] = this[trigger];
            validation_rules[trigger] = this.validation_rules[trigger].rules || [];
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
    validateAllProperties() {
        const validation_rules = Object.keys(this.validation_rules);
        const validation_errors = Object.keys(this.validation_errors);

        validation_rules.forEach(p => {
            this.validateProperty(p, this[p]);
        });

        // Remove keys that are present in error, but not in rules:
        validation_errors.forEach(error => {
            if (!validation_rules.includes(error)) {
                delete this.validation_errors[error];
            }
        });
    }

    onSwitchAccount(listener) {
        if (listener) {
            this.switch_account_listener = listener;

            this.switchAccountDisposer = when(
                () => this.root_store.client.switch_broadcast,
                async () => {
                    try {
                        const result = this.switch_account_listener();
                        if (result && result.then && typeof result.then === 'function') {
                            result.then(() => {
                                this.root_store.client.switchEndSignal();
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

    onPreSwitchAccount(listener) {
        if (listener) {
            this.pre_switch_account_listener = listener;

            this.preSwitchAccountDisposer = when(
                () => this.root_store.client.pre_switch_broadcast,
                async () => {
                    try {
                        const result = this.pre_switch_account_listener?.();
                        if (result && result.then && typeof result.then === 'function') {
                            result.then(() => {
                                this.root_store.client.setPreSwitchAccount(false);
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

    onLogout(listener) {
        this.logoutDisposer = when(
            () => this.root_store.client.has_logged_out,
            async () => {
                try {
                    const result = this.logout_listener();
                    if (result && result.then && typeof result.then === 'function') {
                        result.then(() => {
                            this.root_store.client.setLogout(false);
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

    onClientInit(listener) {
        this.clientInitDisposer = when(
            () => this.root_store.client.initialized_broadcast,
            async () => {
                try {
                    const result = this.client_init_listener();
                    if (result && result.then && typeof result.then === 'function') {
                        result.then(() => {
                            this.root_store.client.setInitialized(false);
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

    onNetworkStatusChange(listener) {
        this.networkStatusChangeDisposer = reaction(
            () => this.root_store.common.is_network_online,
            is_online => {
                try {
                    this.network_status_change_listener(is_online);
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

    onThemeChange(listener) {
        this.themeChangeDisposer = reaction(
            () => this.root_store.ui.is_dark_mode_on,
            is_dark_mode_on => {
                try {
                    this.theme_change_listener(is_dark_mode_on);
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

    onRealAccountSignupEnd(listener) {
        this.realAccountSignupEndedDisposer = when(
            () => this.root_store.ui.has_real_account_signup_ended,
            () => {
                try {
                    const result = this.real_account_signup_ended_listener();
                    if (result && result.then && typeof result.then === 'function') {
                        result.then(() => {
                            this.root_store.ui.setRealAccountSignupEnd(false);
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

    disposePreSwitchAccount() {
        if (typeof this.preSwitchAccountDisposer === 'function') {
            this.preSwitchAccountDisposer();
        }
        this.pre_switch_account_listener = null;
    }

    disposeSwitchAccount() {
        if (typeof this.switchAccountDisposer === 'function') {
            this.switchAccountDisposer();
        }
        this.switch_account_listener = null;
    }

    disposeLogout() {
        if (typeof this.logoutDisposer === 'function') {
            this.logoutDisposer();
        }
        this.logout_listener = null;
    }

    disposeClientInit() {
        if (typeof this.clientInitDisposer === 'function') {
            this.clientInitDisposer();
        }
        this.client_init_listener = null;
    }

    disposeNetworkStatusChange() {
        if (typeof this.networkStatusChangeDisposer === 'function') {
            this.networkStatusChangeDisposer();
        }
        this.network_status_change_listener = null;
    }

    disposeThemeChange() {
        if (typeof this.themeChangeDisposer === 'function') {
            this.themeChangeDisposer();
        }
        this.theme_change_listener = null;
    }

    disposeRealAccountSignupEnd() {
        if (typeof this.realAccountSignupEndedDisposer === 'function') {
            this.realAccountSignupEndedDisposer();
        }
        this.real_account_signup_ended_listener = null;
    }

    onUnmount() {
        this.disposePreSwitchAccount();
        this.disposeSwitchAccount();
        this.disposeLogout();
        this.disposeClientInit();
        this.disposeNetworkStatusChange();
        this.disposeThemeChange();
        this.disposeRealAccountSignupEnd();
    }

    assertHasValidCache(loginid, ...reactions) {
        // account was changed when this was unmounted.
        if (this.root_store.client.loginid !== loginid) {
            reactions.forEach(act => act());
            this.partial_fetch_time = false;
        }
    }
}
