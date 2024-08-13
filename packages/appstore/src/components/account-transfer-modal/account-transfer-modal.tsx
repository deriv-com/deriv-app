import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Modal, Dialog } from '@deriv/components';
import { routes } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import AccountTransfer from '@deriv/cashier/src/pages/account-transfer';
import './account-transfer-modal.scss';

type TAccountTransferModal = {
    is_modal_open: boolean;
    toggleModal: (e?: boolean) => void;
};

const AccountTransferModal = observer(({ is_modal_open, toggleModal }: TAccountTransferModal) => {
    const {
        modules: {
            cashier: {
                account_transfer: { is_transfer_confirm, should_switch_account, setShouldSwitchAccount, error },
                general_store: { setActiveTab },
            },
        },
        traders_hub: { closeModal, setSelectedAccount },
    } = useStore();
    const [is_error_dialog_open, setIsErrorDialogOpen] = React.useState(false);

    const history = useHistory();

    React.useEffect(() => {
        if (is_modal_open) setActiveTab('account_transfer');
        if (error.code === 'FinancialAssessmentRequired') setIsErrorDialogOpen(true);

        return () => {
            if (is_modal_open) {
                setShouldSwitchAccount(false);
                setSelectedAccount({});
                setActiveTab('deposit');
                closeModal();
            }
            if (error.code === 'FinancialAssessmentRequired') setIsErrorDialogOpen(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_modal_open, error.code]);

    const modal_title = !is_transfer_confirm && <Localize i18n_default_text={'Transfer funds to your accounts'} />;

    const onClickDeposit = () => {
        toggleModal();
        history.push(routes.cashier_deposit);
    };

    const onClickNotes = () => {
        toggleModal();
        history.push(routes.cashier_acc_transfer);
    };

    if (is_error_dialog_open) {
        return (
            <Dialog
                title={localize('Cashier Error')}
                confirm_button_text={localize('OK')}
                onConfirm={() => {
                    toggleModal();
                    setIsErrorDialogOpen(false);
                    error.setErrorMessage({ code: '', message: '' }, null, false);
                }}
                is_visible={is_error_dialog_open}
                has_close_icon={false}
                dismissable={false}
            >
                <Localize
                    i18n_default_text='Please complete your <0>financial assessment</0>.'
                    components={[
                        <Link
                            to={routes.financial_assessment}
                            key={0}
                            className='link'
                            onClick={() => {
                                toggleModal();
                                setIsErrorDialogOpen(false);
                                error.setErrorMessage({ code: '', message: '' }, null, false);
                            }}
                        />,
                    ]}
                />
            </Dialog>
        );
    }

    return (
        <Modal
            className={should_switch_account ? 'account-transfer-modal' : ''}
            has_close_icon={!is_transfer_confirm}
            is_open={is_modal_open}
            is_title_centered={is_transfer_confirm}
            small
            title={modal_title}
            toggleModal={toggleModal}
            should_header_stick_body={false}
        >
            <Modal.Body>
                <AccountTransfer onClickDeposit={onClickDeposit} onClickNotes={onClickNotes} onClose={toggleModal} />
            </Modal.Body>
        </Modal>
    );
});

export default AccountTransferModal;
