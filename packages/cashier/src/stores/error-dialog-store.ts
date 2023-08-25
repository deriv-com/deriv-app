import { observable, action, makeObservable } from 'mobx';

export default class ErrorDialogStore {
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

    confirm_button_text = '';
    error_message = '';
    has_no_close_icon = false;
    should_show = false;
    should_not_show_title = false;

    setShouldShow(value: boolean): void {
        this.should_show = value;
    }

    setErrorMessage(message: string): void {
        this.error_message = message;
        this.setShouldShow(true);
    }

    setConfirmButtonText(text: string): void {
        this.confirm_button_text = text;
    }

    setShouldNotShowTitle(value: boolean): void {
        this.should_not_show_title = value;
    }

    setHasNoCloseIcon(value: boolean): void {
        this.has_no_close_icon = value;
    }

    openReadMoreDialog(error_content: string, confirm_button_text: string): void {
        this.setErrorMessage(error_content);
        this.setConfirmButtonText(confirm_button_text);
        this.setHasNoCloseIcon(true);
        this.setShouldNotShowTitle(true);
    }

    reset(): void {
        this.setConfirmButtonText('');
        this.setShouldNotShowTitle(false);
        this.setHasNoCloseIcon(false);
    }
}
