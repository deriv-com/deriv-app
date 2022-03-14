import { observable, action } from 'mobx';

export default class ErrorDialogStore {
    @observable confirm_button_text = '';
    @observable error_message = '';
    @observable has_no_close_icon = false;
    @observable should_show = false;
    @observable should_not_show_title = false;

    @action.bound
    setShouldShow(value) {
        this.should_show = value;
    }

    @action.bound
    setErrorMessage(message) {
        this.error_message = message;
        this.setShouldShow(true);
    }

    @action.bound
    setConfirmButtonText(text) {
        this.confirm_button_text = text;
    }

    @action.bound
    setShouldNotShowTitle(value) {
        this.should_not_show_title = value;
    }

    @action.bound
    setHasNoCloseIcon(value) {
        this.has_no_close_icon = value;
    }

    @action.bound
    openReadMoreDialog(error_content, confirm_button_text) {
        this.setErrorMessage(error_content);
        this.setConfirmButtonText(confirm_button_text);
        this.setHasNoCloseIcon(true);
        this.setShouldNotShowTitle(true);
    }

    @action.bound
    reset() {
        this.setConfirmButtonText('');
        this.setShouldNotShowTitle(false);
        this.setHasNoCloseIcon(false);
    }
}
