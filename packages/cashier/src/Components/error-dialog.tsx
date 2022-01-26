import React from 'react';
import { localize } from '@deriv/translations';
import { Dialog } from '@deriv/components';
import { connect } from 'Stores/connect';

type ErrorDialogProps = {
    confirm_button_text: string;
    error_message: string;
    has_no_close_icon: boolean;
    reset: () => void;
    setShouldShow: () => void;
    should_show: boolean;
    should_not_show_title: string;
};

const ErrorDialog = ({
    confirm_button_text,
    error_message,
    has_no_close_icon,
    reset,
    setShouldShow,
    should_show,
    should_not_show_title,
}: ErrorDialogProps) => {
    React.useEffect(() => {
        if (!should_show) {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [should_show]);

    return (
        <Dialog
            className='acc-prompt-dialog'
            title={should_not_show_title ? '' : localize('Error')}
            confirm_button_text={confirm_button_text === '' ? localize('Retry') : confirm_button_text}
            onConfirm={() => setShouldShow(false)}
            is_visible={should_show}
            onEscapeButtonCancel={() => setShouldShow(false)}
            has_close_icon={!has_no_close_icon}
        >
            {error_message}
        </Dialog>
    );
};

export default connect(({ modules }) => ({
    confirm_button_text: modules.cashier.error_dialog.confirm_button_text,
    error_message: modules.cashier.error_dialog.error_message,
    has_no_close_icon: modules.cashier.error_dialog.has_no_close_icon,
    reset: modules.cashier.error_dialog.reset,
    setShouldShow: modules.cashier.error_dialog.setShouldShow,
    should_show: modules.cashier.error_dialog.should_show,
    should_not_show_title: modules.cashier.error_dialog.should_not_show_title,
}))(ErrorDialog);
