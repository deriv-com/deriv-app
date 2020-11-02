import { observable, action } from 'mobx';
import { requestWS } from 'Utils/websocket';
import { secondsToTimer } from 'Utils/date-time';
import ServerTime from 'Utils/server-time';
import { localize } from 'Components/i18next';

export default class OrderDetailsStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable chat_channel_url = '';
    @observable interval = null;
    @observable popup_options = {};
    @observable remaining_time;
    @observable should_show_popup = false;

    @action.bound
    countDownTimer() {
        const distance = ServerTime.getDistanceToServerTime(
            this.root_store.order_store.order_information.order_expiry_milliseconds
        );
        const timer = secondsToTimer(distance);

        if (distance < 0) {
            this.setRemainingTime(localize('expired'));
            clearInterval(this.interval);
        } else {
            this.setRemainingTime(timer);
        }
    }

    @action.bound
    createChatForNewOrder(id) {
        if (!this.chat_channel_url) {
            // If order_information doesn't have chat_channel_url this is a new order
            // and we need to instruct BE to create a chat on Sendbird's side.
            requestWS({ p2p_chat_create: 1, order_id: id }).then(response => {
                if (response.error) {
                    // TODO: Handle error.
                    return;
                }

                this.setChatChannelUrl(response.p2p_chat_create);
            });
        }
    }

    @action.bound
    handleShowPopup(options) {
        this.setPopupOptions(options);
        this.setShouldShowPopup(true);
    }

    @action.bound
    onCancelClick() {
        this.setShouldShowPopup(false);
    }

    @action.bound
    setChatChannelUrl(chat_channel_url) {
        this.chat_channel_url = chat_channel_url;
    }

    @action.bound
    setIntervalState(interval) {
        this.interval = interval;
    }

    @action.bound
    setPopupOptions(popup_options) {
        this.popup_options = popup_options;
    }

    @action.bound
    setRemainingTime(remaining_time) {
        this.remaining_time = remaining_time;
    }

    @action.bound
    setShouldShowPopup(should_show_popup) {
        this.should_show_popup = should_show_popup;
    }
}
