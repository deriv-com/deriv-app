import { observable, action, makeObservable } from 'mobx';

export default class OrderDetailsStore {
    constructor(root_store) {
        makeObservable(this, {
            error_message: observable,
            interval: observable,
            popup_options: observable,
            remaining_time: observable,
            should_show_popup: observable,
            handleShowPopup: action.bound,
            onCancelClick: action.bound,
            setErrorMessage: action.bound,
            setIntervalState: action.bound,
            setPopupOptions: action.bound,
            setShouldShowPopup: action.bound,
        });

        this.root_store = root_store;
    }

    error_message = '';
    interval = null;
    popup_options = {};
    remaining_time;
    should_show_popup = false;

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

    setShouldShowPopup(should_show_popup) {
        this.should_show_popup = should_show_popup;
    }
}
