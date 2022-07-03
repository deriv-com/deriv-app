import { observable, action, makeObservable } from 'mobx';

export default class ErrorDialogStore {
    confirm_button_text = '';
    error_message = '';
    has_no_close_icon = false;
    should_show = false;
    should_not_show_title = false;

    constructor() {
        makeObservable(this, {
            confirm_button_text: observable,
            error_message: observable,
            has_no_close_icon: observable,
            should_show: observable,
            should_not_show_title: observable,
            setShouldShow: action.bound,
            setErrorMessage: action.bound,
            setConfirmButtonText: action.bound,
            setShouldNotShowTitle: action.bound,
            setHasNoCloseIcon: action.bound,
            openReadMoreDialog: action.bound,
            reset: action.bound,
        });
    }

    setShouldShow(value) {
        this.should_show = value;
    }

    setErrorMessage(message) {
        this.error_message = message;
        this.setShouldShow(true);
    }

    setConfirmButtonText(text) {
        this.confirm_button_text = text;
    }

    setShouldNotShowTitle(value) {
        this.should_not_show_title = value;
    }

    setHasNoCloseIcon(value) {
        this.has_no_close_icon = value;
    }

    openReadMoreDialog(error_content, confirm_button_text) {
        this.setErrorMessage(error_content);
        this.setConfirmButtonText(confirm_button_text);
        this.setHasNoCloseIcon(true);
        this.setShouldNotShowTitle(true);
    }

    reset() {
        this.setConfirmButtonText('');
        this.setShouldNotShowTitle(false);
        this.setHasNoCloseIcon(false);
    }
}
