import { observable, action } from 'mobx';

export default class ErrorDialogStore {
    @observable error_message = '';
    @observable should_show = false;

    @action.bound
    setShouldShow(value) {
        this.should_show = value;
    }

    @action.bound
    setErrorMessage(message) {
        this.error_message = message;
        this.setShouldShow(true);
    }
}
