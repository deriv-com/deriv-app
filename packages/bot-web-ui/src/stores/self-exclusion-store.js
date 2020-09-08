import { observable, action, computed } from 'mobx';

export default class SelfExclusionStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable api_max_losses = 0;
    @observable run_limit = -1;
    @observable is_restricted = false;
    @computed
    get initial_values() {
        return {
            form_max_losses: this.api_max_losses || '',
            run_limit: this.run_limit !== -1 ? this.run_limit : '',
        };
    }

    @computed
    get should_bot_run() {
        const { client } = this.root_store.core;
        if (client.is_eu && !client.is_virtual && (this.api_max_losses === 0 || this.run_limit === -1)) {
            return false;
        }
        return true;
    }

    @action.bound
    setIsRestricted(is_restricted) {
        this.is_restricted = is_restricted;
    }

    @action.bound
    setApiMaxLosses(api_max_losses) {
        this.api_max_losses = api_max_losses;
    }

    @action.bound
    setRunLimit(run_limit) {
        this.run_limit = run_limit;
    }

    @action.bound
    resetSelfExclusion() {
        this.is_restricted = false;
        this.api_max_losses = 0;
        this.form_max_losses = 0;
        this.run_limit = -1;
    }

    @action.bound
    async checkRestriction() {
        const { client } = this.root_store.core;
        await client.getSelfExclusion();
        if (client.self_exclusion.max_losses) {
            this.setApiMaxLosses(client.self_exclusion.max_losses);
        }
    }
}
