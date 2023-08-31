import React from 'react';
import { Redirect } from 'react-router-dom';
import { Loading, Modal, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { useCloseDerivAccount } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import ClosingAccountHasPendingConditions from './closing-account-pending-conditions/closing-account-has-pending-conditions';
import ClosingAccountReasonForm from './closing-account-reason-form';
import ClosingAccountWarningModal from './closing-account-warning-modal';
import ClosingAccountGeneralErrorContent from './closing-account-general-error-content';

type TClosingAccountReasonProps = {
    redirectToSteps: () => void;
};

const MAX_ALLOWED_REASONS = 3;

const ClosingAccountReason = ({ redirectToSteps }: TClosingAccountReasonProps) => {
    const { mutate, error, isSuccess, isLoading } = useCloseDerivAccount();

    const [modal_info, setModalnfo] = React.useState({
        is_modal_open: false,
        modal_type: '',
    });

    const [reasons_to_close_account, setReasonsToCloseAccount] = React.useState('');

    React.useEffect(() => {
        if (error) {
            if (typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
                const { code } = error;
                const getModalToRender = () => {
                    if (code === 'AccountHasPendingConditions') {
                        return 'account_has_pending_conditions_modal';
                    }
                    if (code === 'MT5AccountInaccessible') {
                        return 'inaccessible_modal';
                    }
                    return 'error_modal';
                };

                setModalnfo({ is_modal_open: true, modal_type: getModalToRender() });
            }
        }
    }, [error]);

    const getModalTitle = () => {
        switch (modal_info.modal_type) {
            case 'error_modal':
                return <Localize i18n_default_text='An error occurred' />;
            case 'inaccessible_modal':
                return <Localize i18n_default_text='Inaccessible MT5 account(s)' />;
            case 'warning_modal':
                return '';
            default:
                return <Localize i18n_default_text='Action required' />;
        }
    };
    const getModalContent = () => {
        switch (modal_info.modal_type) {
            case 'warning_modal':
                return <ClosingAccountWarningModal closeModal={closeModal} startDeactivating={startDeactivating} />;
            case 'account_has_pending_conditions_modal':
                return (
                    <ClosingAccountHasPendingConditions
                        details={
                            error &&
                            typeof error === 'object' &&
                            'details' in error &&
                            typeof error.details === 'object'
                                ? error.details
                                : {}
                        }
                        onConfirm={redirectToSteps}
                    />
                );
            case 'inaccessible_modal':
                return (
                    <ClosingAccountGeneralErrorContent
                        message={
                            error &&
                            typeof error === 'object' &&
                            'message' in error &&
                            typeof error.message === 'string'
                                ? error.message
                                : ''
                        }
                        onClick={closeModal}
                    />
                );
            default:
                return null;
        }
    };

    const onConfirm = (final_reason: string) => {
        setModalnfo({ is_modal_open: true, modal_type: 'warning_modal' });
        setReasonsToCloseAccount(final_reason);
    };

    const closeModal = () => {
        setModalnfo({ is_modal_open: false, modal_type: '' });
    };

    const startDeactivating = async () => {
        closeModal();
        mutate({ payload: { reason: reasons_to_close_account } });
    };

    if (isSuccess) return <Redirect to={routes.account_closed} />;

    if (isLoading) return <Loading is_fullscreen={false} />;

    return (
        <div className='closing-account-reasons'>
            <Text weight='bold' size='xs' className='closing-account-reasons__title' as='p'>
                <Localize
                    i18n_default_text='Please tell us why you’re leaving. (Select up to {{ allowed_reasons }} reasons.)'
                    values={{ allowed_reasons: MAX_ALLOWED_REASONS }}
                />
            </Text>
            <ClosingAccountReasonForm onBackClick={redirectToSteps} onConfirmClick={onConfirm} />

            {modal_info.is_modal_open && modal_info.modal_type && (
                <Modal
                    className='closing-account-reasons'
                    is_open={modal_info.is_modal_open}
                    toggleModal={closeModal}
                    title={getModalTitle()}
                >
                    {getModalContent()}
                </Modal>
            )}
        </div>
    );
};

export default ClosingAccountReason;
