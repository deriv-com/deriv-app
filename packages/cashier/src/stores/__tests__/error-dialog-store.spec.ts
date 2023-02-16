import ErrorDialogStore from '../error-dialog-store';

let error_dialog_store: ErrorDialogStore;

beforeEach(() => {
    error_dialog_store = new ErrorDialogStore();
});

describe('ErrorDialogStore', () => {
    it('should change value of the variable should_show', () => {
        error_dialog_store.setShouldShow(true);

        expect(error_dialog_store.should_show).toBeTruthy();
    });

    it('should set and show error message', () => {
        error_dialog_store.setErrorMessage('Error message');

        expect(error_dialog_store.error_message).toBe('Error message');
        expect(error_dialog_store.should_show).toBeTruthy();
    });

    it('should change value of the variable confirm_button_text', () => {
        error_dialog_store.setConfirmButtonText('Button text');

        expect(error_dialog_store.confirm_button_text).toBe('Button text');
    });

    it('should change value of the variable should_not_show_title', () => {
        error_dialog_store.setShouldNotShowTitle(true);

        expect(error_dialog_store.should_not_show_title).toBeTruthy();
    });

    it('should change value of the variable has_no_close_icon', () => {
        error_dialog_store.setHasNoCloseIcon(true);

        expect(error_dialog_store.has_no_close_icon).toBeTruthy();
    });

    it('should open ReadMore dialog with proper content and parameters', () => {
        error_dialog_store.openReadMoreDialog('Error message', 'Button text');

        expect(error_dialog_store.error_message).toBe('Error message');
        expect(error_dialog_store.confirm_button_text).toBe('Button text');
        expect(error_dialog_store.has_no_close_icon).toBeTruthy();
        expect(error_dialog_store.should_not_show_title).toBeTruthy();
    });

    it('should reset an error dialog', () => {
        error_dialog_store.reset();

        expect(error_dialog_store.confirm_button_text).toBe('');
        expect(error_dialog_store.should_not_show_title).toBeFalsy();
        expect(error_dialog_store.has_no_close_icon).toBeFalsy();
    });
});
