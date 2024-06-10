import { action, intercept, observable, reaction, toJS, when, makeObservable } from 'mobx';
import { isProduction, isEmptyObject, Validator } from '@deriv/shared';
import { getValidationRules } from './Modules/Trading/Constants/validation-rules';
import { TRootStore } from 'Types';

type TValidationRules = ReturnType<typeof getValidationRules> | Record<string, never>;

type TBaseStoreOptions = {
    root_store: TRootStore;
    local_storage_properties?: string[];
    session_storage_properties?: string[];
    validation_rules?: TValidationRules;
    store_name?: string;
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
    clientInitDisposer: null | (() => void) = null;
    client_init_listener: null | (() => Promise<void>) = null;
    logoutDisposer: null | (() => void) = null;
    logout_listener: null | (() => Promise<void>) = null;
    local_storage_properties: string[];
    networkStatusChangeDisposer: null | (() => void) = null;
    network_status_change_listener: null | ((is_online: boolean) => void) = null;
    partial_fetch_time = 0;
    preSwitchAccountDisposer: null | (() => void) = null;
    pre_switch_account_listener: null | (() => Promise<void>) = null;
    realAccountSignupEndedDisposer: null | (() => void) = null;
    real_account_signup_ended_listener: null | (() => Promise<void>) = null;
    root_store: TRootStore;
    session_storage_properties: string[];
    store_name = '';
    switchAccountDisposer: null | (() => void) = null;
    switch_account_listener: null | (() => Promise<void>) = null;
    themeChangeDisposer: null | (() => void) = null;
    theme_change_listener: null | ((is_dark_mode_on: boolean) => void) = null;
    validation_errors: { [key: string]: string[] } = {};
    validation_rules: TValidationRules | Record<string, never> = {};
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
    constructor(options = {} as TBaseStoreOptions) {
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

        const has_local_or_session_storage = local_storage_properties?.length || session_storage_properties?.length;

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
    getSnapshot(properties: string[]): object {
        let snapshot = toJS(this);

        if (!isEmptyObject(this.root_store)) {
            snapshot.root_store = this.root_store;
        }

        if (properties?.length) {
            snapshot = properties.reduce(
                (result, p) => Object.assign(result, { [p]: snapshot[p as keyof this] }),
                {} as this
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
        if (this.local_storage_properties.length) {
            reaction(
                () => this.local_storage_properties.map(i => this[i as keyof this]),
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
                () => this.session_storage_properties.map(i => this[i as keyof this]),
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
    saveToStorage(properties: string[] = [], storage = Symbol('')) {
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
    setValidationErrorMessages(propertyName: string, messages: string[]) {
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
    setValidationRules(rules: TValidationRules = {}): void {
        Object.keys(rules).forEach(key => {
            this.addRule<keyof TValidationRules>(key as keyof TValidationRules, rules[key as keyof TValidationRules]);
        });
    }

    /**
     * Adds rules to the particular property
     *
     * @param {String} property
     * @param {String} rules
     *
     */
    addRule<T extends keyof TValidationRules>(property: T, rules: TValidationRules[T]) {
        this.validation_rules[property] = rules;

        intercept(this, property as unknown as keyof this, change => {
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
    validateProperty<T extends BaseStore>(property: string, value: T[keyof T]) {
        const validation_rules_for_property = this.validation_rules[property] ?? {};
        const trigger = (
            'trigger' in validation_rules_for_property ? validation_rules_for_property.trigger : undefined
        ) as keyof this;
        const inputs = { [property]: value ?? this[property as keyof this] } as Pick<this, keyof this>;
        const validation_rules = {
            [property]: 'rules' in validation_rules_for_property ? validation_rules_for_property.rules : [],
        };

        if (!!trigger && Object.hasOwnProperty.call(this, trigger)) {
            const validation_rules_for_trigger = this.validation_rules[trigger as keyof TValidationRules];
            inputs[trigger] = this[trigger];
            validation_rules[trigger as keyof TValidationRules] =
                'rules' in validation_rules_for_trigger ? validation_rules_for_trigger.rules : [];
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
            this.validateProperty(p, this[p as keyof this]);
        });

        // Remove keys that are present in error, but not in rules:
        validation_errors.forEach(error => {
            if (!validation_rules.includes(error)) {
                delete this.validation_errors[error];
            }
        });
    }

    onSwitchAccount(listener: null | (() => Promise<void>)): void {
        if (listener) {
            this.switch_account_listener = listener;

            this.switchAccountDisposer = when(
                () => !!this.root_store.client.switch_broadcast,
                () => {
                    try {
                        const result = this.switch_account_listener?.();
                        if (result?.then && typeof result.then === 'function') {
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

    onPreSwitchAccount(listener: null | (() => Promise<void>)): void {
        if (listener) {
            this.pre_switch_account_listener = listener;
            this.preSwitchAccountDisposer = when(
                () => !!this.root_store.client.pre_switch_broadcast,
                () => {
                    try {
                        const result = this.pre_switch_account_listener?.();
                        if (result?.then && typeof result.then === 'function') {
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

    onLogout(listener: null | (() => Promise<void>)): void {
        this.logoutDisposer = when(
            () => !!this.root_store.client.has_logged_out,
            async () => {
                try {
                    const result = this.logout_listener?.();
                    if (result?.then && typeof result.then === 'function') {
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

    onClientInit(listener: null | (() => Promise<void>)): void {
        this.clientInitDisposer = when(
            () => !!this.root_store.client.initialized_broadcast,
            async () => {
                try {
                    const result = this.client_init_listener?.();
                    if (result?.then && typeof result.then === 'function') {
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

    onNetworkStatusChange(listener: null | ((is_online: boolean) => void)): void {
        this.networkStatusChangeDisposer = reaction(
            () => this.root_store.common.is_network_online,
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

    onThemeChange(listener: null | ((is_dark_mode_on: boolean) => void)): void {
        this.themeChangeDisposer = reaction(
            () => this.root_store.ui.is_dark_mode_on,
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

    onRealAccountSignupEnd(listener: null | (() => Promise<void>)): void {
        this.realAccountSignupEndedDisposer = when(
            () => !!this.root_store.ui.has_real_account_signup_ended,
            () => {
                try {
                    const result = this.real_account_signup_ended_listener?.();
                    if (result?.then && typeof result.then === 'function') {
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

    assertHasValidCache(loginid: string, ...reactions: VoidFunction[]): void {
        // account was changed when this was unmounted.
        if (this.root_store.client.loginid !== loginid) {
            reactions.forEach(act => act());
            this.partial_fetch_time = 0;
        }
    }
}
