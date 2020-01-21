import React        from 'react';
import { Dialog }   from '@deriv/components';
import {
    Localize,
    localize }      from '@deriv/translations';
import { connect }  from 'Stores/connect';

const Mt5AdvancedPendingDialog = ({
    enableApp,
    disableApp,
    toggleModal,
    is_mt5_pending_dialog_open,
}) => (
    <div className='mt5-pending-dialog'>
        <Dialog
            title={localize('Thanks for submitting your documents!')}
            confirm_button_text={localize('Ok')}
            onConfirm={toggleModal}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={false}
            is_closed_on_cancel
            is_visible={is_mt5_pending_dialog_open}
        >
            <Localize
                i18n_default_text='We’ll process your documents within 1-3 days. Once they are verified, we’ll notify you via email.'
            />
        </Dialog>
    </div>
);

export default connect(({ ui, modules: { mt5 } }) => ({
    enableApp                 : ui.enableApp,
    disableApp                : ui.disableApp,
    toggleModal               : mt5.closeMT5PendingDialog,
    is_mt5_pending_dialog_open: mt5.is_mt5_pending_dialog_open,
}))(Mt5AdvancedPendingDialog);
