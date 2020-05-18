import { action, computed, observable, runInAction } from 'mobx';

class WorkspaceStore {
    @observable webview_ref = null;

    @computed 
    get is_webview_mounted() {
        return webview_ref !== null;
    }

    constructor(root_store) {
        this.root_store = root_store;
        this.api = this.root_store.api;
    }

    @action.bound
    setWebViewRef(ref) {
        this.webview_ref = ref;
    }

    @action.bound
    getWebViewRef() {
        return this.webview_ref;
    }

    @action.bound
    incrementTime() {
        this.current_time += 1;
    }

    @action.bound
    syncServerTime() {
        clearInterval(this.seconds_interval);
        const request_time = Math.floor(Date.now() / 1000);

        this.api.basic.send({ time: 1 }).then(response => {
            const response_time = Math.floor(Date.now() / 1000);
            const time_taken = response_time - request_time;
            const server_time_at_response = response.time * 1000 + time_taken;

            runInAction(() => {
                this.current_time = server_time_at_response;
            });

            this.seconds_interval = setInterval(() => this.incrementTime(), 1000);
        });
    }
}

export default WorkspaceStore;
