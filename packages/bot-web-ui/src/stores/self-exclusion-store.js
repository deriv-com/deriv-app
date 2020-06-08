import { observable, action, computed, runInAction } from 'mobx';

export default class SelfExclusionStore {
    constructor(root_store) {
        this.root_store = root_store;
        this.dbot = this.root_store.dbot;
    }

    @observable max_losses = '';
    @observable set_max_losses = '';
    @observable run_limit = '';
    @observable is_restricted = false;

    @computed
    get initial_values() {
        return {
            set_max_losses: this.set_max_losses || '',
            run_limit: this.run_limit,
        };
    }

    @action.bound
    setLimitations(key, value) {
        this[key] = value;
    }

    @action.bound
    checkClientRestriction() {
        const { client } = this.root_store.core;
        // !client.is_eu should update to client.is_eu it's just for test because of restrictions on eu accounts
        if (!client.is_eu && !client.is_virtual && (!this.max_losses || !this.run_limit)) {
            this.is_restricted = true;
        } else {
            this.is_restricted = false;
        }
    }

    @action.bound
    resetSelfExclusion() {
        this.is_restricted = false;
        this.max_losses = '';
        this.set_max_losses = '';
        this.run_limit = '';
    }

    @action.bound
    async checkRestriction() {
        const { core } = this.root_store;
        const { client } = core;

        const self_exclusion = await client.getSelfExclusion();
        runInAction(() => {
            this.max_losses = self_exclusion?.get_self_exclusion?.max_losses;
            this.checkClientRestriction();
            if (client.self_exclusion.max_losses) {
                this.max_losses = client.self_exclusion.max_losses;
                this.set_max_losses = client.self_exclusion.max_losses;
            }
        });
    }
    @action.bound
    ToggleSelfExclusion = () => {
        this.resetSelfExclusion();
    };
}
