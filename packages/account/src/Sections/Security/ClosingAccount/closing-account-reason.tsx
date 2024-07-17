import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Loading, Modal, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { useCloseDerivAccount } from '@deriv/api';
import { Localize } from '@deriv-com/translations';
import { MAX_ALLOWED_REASONS_FOR_CLOSING_ACCOUNT } from '../../../Constants/closing-account-config';
import ClosingAccountHasPendingConditions from './closing-account-pending-conditions/closing-account-has-pending-conditions';
import ClosingAccountReasonForm from './closing-account-reason-form';
import ClosingAccountWarningModal from './closing-account-warning-modal';
import ClosingAccountGeneralErrorContent from './closing-account-general-error-content';

type TClosingAccountReasonProps = {
    redirectToSteps: () => void;
};

const ClosingAccountReason = ({ redirectToSteps }: TClosingAccountReasonProps) => {
    const { mutate, error, isSuccess, isLoading } = useCloseDerivAccount();

    const [reasons_to_close_account, setReasonsToCloseAccount] = useState('');
    const [error_info, setErrorInfo] = useState('');
    const [show_warning_modal, setShowWarningModal] = useState(false);

    useEffect(() => {
        if (error) {
            if (typeof error === 'object' && 'code' in error) {
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

                setErrorInfo(getModalToRender());
            }
        }
    }, [error]);

    const getErrorModalTitle = () => {
        if (!error_info) return '';
        switch (error_info) {
            case 'error_modal':
                return <Localize i18n_default_text='An error occurred' />;
            case 'inaccessible_modal':
                return <Localize i18n_default_text='Inaccessible MT5 account(s)' />;
            default:
                return <Localize i18n_default_text='Action required' />;
        }
    };

    const getErrorModalContent = () => {
        switch (error_info) {
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
                        onClick={closeErrorModal}
                    />
                );
            default:
                return null;
        }
    };

    const onConfirm = (final_reason: string) => {
        setShowWarningModal(true);
        setReasonsToCloseAccount(final_reason);
    };

    const closeErrorModal = () => {
        setErrorInfo('');
    };
    const closeWarningModal = () => {
        setShowWarningModal(false);
    };

    const startDeactivating = async () => {
        closeWarningModal();
        mutate({ payload: { reason: reasons_to_close_account } });
    };

    if (isSuccess) return <Redirect to={routes.account_closed} />;

    if (isLoading) return <Loading is_fullscreen={false} />;

    return (
        <div className='closing-account-reasons'>
            <Text weight='bold' size='xs' className='closing-account-reasons__title' as='p'>
                <Localize
                    i18n_default_text='Please tell us why you’re leaving. (Select up to {{ allowed_reasons }} reasons.)'
                    values={{ allowed_reasons: MAX_ALLOWED_REASONS_FOR_CLOSING_ACCOUNT }}
                />
            </Text>
            <ClosingAccountReasonForm onBackClick={redirectToSteps} onConfirmClick={onConfirm} />

            {show_warning_modal && (
                <ClosingAccountWarningModal
                    show_warning_modal={show_warning_modal}
                    closeWarningModal={closeWarningModal}
                    startDeactivating={startDeactivating}
                />
            )}
            <Modal
                className='closing-account-reasons'
                is_open={!!error_info}
                toggleModal={closeErrorModal}
                title={getErrorModalTitle()}
            >
                {getErrorModalContent()}
            </Modal>
        </div>
    );
};

export default ClosingAccountReason;
