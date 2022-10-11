import { action, observable } from 'mobx';
import Constants from 'Constants/constants';
import { TRootStore } from 'Types';

type TOnIframeLoadedCallback = (ev: MessageEvent) => void;

export default class IframeStore {
    constructor(public root_store: TRootStore) {
        this.root_store = root_store;
    }

    @observable iframe_height = 0;
    @observable iframe_url = '';
    @observable is_session_timeout = true;
    onIframeLoaded: TOnIframeLoadedCallback | null = null;
    @observable timeout_session: NodeJS.Timeout | null = null;

    @action.bound
    setSessionTimeout(is_session_time_out: boolean): void {
        this.is_session_timeout = is_session_time_out;
        if (is_session_time_out) {
            this.removeOnIframeLoaded();
        }
    }

    @action.bound
    async checkIframeLoaded(): Promise<void> {
        const { modules, ui } = this.root_store;

        this.removeOnIframeLoaded();
        this.onIframeLoaded = (e: MessageEvent) => {
            if (/cashier|doughflow/.test(e.origin)) {
                modules.cashier.general_store.setLoading(false);
                // set the height of the container after content loads so that the
                // loading bar stays vertically centered until the end
                if (ui.is_mobile) {
                    this.setContainerHeight(window.innerHeight - 100);
                } else {
                    this.setContainerHeight(window.innerHeight - 190);
                }
                // do not remove the listener
                // on every iframe screen change we need to update the height to more/less to match the new content
            }
        };
        window.addEventListener('message', this.onIframeLoaded, false);
    }

    removeOnIframeLoaded(): void {
        if (this.onIframeLoaded) {
            window.removeEventListener('message', this.onIframeLoaded, false);
            this.onIframeLoaded = null;
        }
    }

    @action.bound
    clearTimeoutCashierUrl(): void {
        if (this.timeout_session) {
            clearTimeout(this.timeout_session);
        }
    }

    @action.bound
    setTimeoutCashierUrl(is_withdrawal?: boolean): void {
        this.clearTimeoutCashierUrl();
        if (is_withdrawal) {
            this.timeout_session = setTimeout(() => {
                this.setSessionTimeout(true);
            }, 60000);
        }
    }

    @action.bound
    setIframeUrl(url: string): void {
        const { client, ui } = this.root_store;

        if (url) {
            this.iframe_url = `${url}&theme=${ui.is_dark_mode_on ? 'dark' : 'light'}`;

            const container = this.root_store.modules.cashier.general_store.active_container;

            if (container in Constants.map_action) {
                const container_key = container as keyof typeof Constants.map_action;

                // after we set iframe url we can clear verification code
                client.setVerificationCode('', Constants.map_action[container_key]);
            }
        } else {
            this.iframe_url = url;
        }
    }

    @action.bound
    setContainerHeight(height: number): void {
        this.iframe_height = height;
    }

    @action.bound
    clearIframe(): void {
        this.setContainerHeight(0);
        this.setIframeUrl('');
        this.clearTimeoutCashierUrl();
        this.setSessionTimeout(true);
    }
}
