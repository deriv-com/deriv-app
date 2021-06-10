import React from 'react';
// import { reject, resolve } from 'core-js/fn/promise';
import { Modal, Button } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';

const Mt5FinancialStpPendingDialog = ({ enableApp, disableApp, toggleModal, is_mt5_pending_dialog_open }) => {
    const checkUserStatus = async () => {
        const { get_account_status } = await WS.authorized.storage.getAccountStatus();
        if (get_account_status) {
            const { identity, document } = get_account_status.authentication;
            const has_poi = !(identity && identity.status === 'none');
            const has_poa = !(document && document.status === 'none');
            if (has_poi || has_poa) return true;
        }
    };
    checkUserStatus().then(response => {
        const modal = document.getElementsByClassName('mt5-pending-dialog');
        console.log(modal);
        if (response) {
        } else {
        }
    });
    return (
        <Modal
            title={localize('Thanks for submitting your documents!')}
            className='mt5-pending-dialog'
            is_open={is_mt5_pending_dialog_open}
            disableApp={disableApp}
            enableApp={enableApp}
            toggleModal={toggleModal}
            has_close_icon={false}
            small
        >
            <Modal.Body>
                <Localize i18n_default_text='We’ll process your documents within 1-3 days. Once they are verified, we’ll notify you via email.' />
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('OK')} onClick={toggleModal} primary />
            </Modal.Footer>
        </Modal>
    );
};

export default connect(({ ui, modules: { mt5 } }) => ({
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    toggleModal: mt5.closeMT5PendingDialog,
    is_mt5_pending_dialog_open: mt5.is_mt5_pending_dialog_open,
}))(Mt5FinancialStpPendingDialog);
