import { observable, action, makeObservable } from 'mobx';
import { secondsToTimer } from 'Utils/date-time';
import ServerTime from 'Utils/server-time';
import { localize } from 'Components/i18next';

export default class OrderDetailsStore {
    constructor(root_store) {
        makeObservable(this, {
            error_message: observable,
            interval: observable,
            popup_options: observable,
            remaining_time: observable,
            should_show_popup: observable,
            countDownTimer: action.bound,
            handleShowPopup: action.bound,
            onCancelClick: action.bound,
            setErrorMessage: action.bound,
            setIntervalState: action.bound,
            setPopupOptions: action.bound,
            setRemainingTime: action.bound,
            setShouldShowPopup: action.bound,
        });

        this.root_store = root_store;
    }

    error_message = '';
    interval = null;
    popup_options = {};
    remaining_time;
    should_show_popup = false;

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

    handleShowPopup(options) {
        this.setPopupOptions(options);
        this.setShouldShowPopup(true);
    }

    onCancelClick() {
        this.setShouldShowPopup(false);
    }

    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    setIntervalState(interval) {
        this.interval = interval;
    }

    setPopupOptions(popup_options) {
        this.popup_options = popup_options;
    }

    setRemainingTime(remaining_time) {
        this.remaining_time = remaining_time;
    }

    setShouldShowPopup(should_show_popup) {
        this.should_show_popup = should_show_popup;
    }
}
