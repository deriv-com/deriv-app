import React from 'react';
import { Modal, Button } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { TCFDFinancialStpPendingDialog } from './props.types';
import RootStore from 'Stores/index';

const CFDFinancialStpPendingDialog = ({
    enableApp,
    disableApp,
    toggleModal,
    is_cfd_pending_dialog_open,
    is_fully_authenticated,
}: TCFDFinancialStpPendingDialog) => (
    <Modal
        title={is_fully_authenticated ? ' ' : localize('Thanks for submitting your documents!')}
        className='cfd-pending-dialog'
        is_open={is_cfd_pending_dialog_open}
        disableApp={disableApp}
        enableApp={enableApp}
        toggleModal={toggleModal}
        has_close_icon={false}
        small
    >
        <Modal.Body>
            {is_fully_authenticated ? (
                <Localize i18n_default_text='Your MT5 Financial STP account is almost ready, please set your password now.' />
            ) : (
                <Localize i18n_default_text='We’ll process your documents within 1-3 days. Once they are verified, we’ll notify you via email.' />
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button has_effect text={localize('OK')} onClick={toggleModal} primary />
        </Modal.Footer>
    </Modal>
);

export default connect(({ ui, client, modules: { cfd } }: RootStore) => ({
    is_fully_authenticated: client.is_fully_authenticated,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    toggleModal: cfd.closeCFDPendingDialog,
    is_cfd_pending_dialog_open: cfd.is_cfd_pending_dialog_open,
}))(CFDFinancialStpPendingDialog);
