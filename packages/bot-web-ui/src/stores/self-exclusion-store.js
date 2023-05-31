import { observable, action, computed, makeObservable } from 'mobx';

export default class SelfExclusionStore {
    constructor(root_store, core) {
        makeObservable(this, {
            api_max_losses: observable,
            run_limit: observable,
            is_restricted: observable,
            initial_values: computed,
            should_bot_run: computed,
            setIsRestricted: action.bound,
            setApiMaxLosses: action.bound,
            setRunLimit: action.bound,
            resetSelfExclusion: action.bound,
            checkRestriction: action.bound,
        });

        this.root_store = root_store;
        this.core = core;
    }

    api_max_losses = 0;
    run_limit = -1;
    is_restricted = false;
    get initial_values() {
        return {
            form_max_losses: this.api_max_losses || '',
            run_limit: this.run_limit !== -1 ? this.run_limit : '',
        };
    }

    get should_bot_run() {
        const { client } = this.core;
        if (client.is_eu && !client.is_virtual && (this.api_max_losses === 0 || this.run_limit === -1)) {
            return false;
        }
        return true;
    }

    setIsRestricted(is_restricted) {
        this.is_restricted = is_restricted;
    }

    setApiMaxLosses(api_max_losses) {
        this.api_max_losses = api_max_losses;
    }

    setRunLimit(run_limit) {
        this.run_limit = run_limit;
    }

    resetSelfExclusion() {
        this.is_restricted = false;
        this.api_max_losses = 0;
        this.form_max_losses = 0;
        this.run_limit = -1;
    }

    async checkRestriction() {
        const { client } = this.core;
        await client.getSelfExclusion();
        if (client.self_exclusion.max_losses) {
            this.setApiMaxLosses(client.self_exclusion.max_losses);
        }
    }
}
