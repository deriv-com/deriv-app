import React from 'react';
import { Button, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getTitle } from './constants';
import AuthorizationRequiredModal from './authorization-required-modal.jsx';
import InsufficientBalanceModal from './insufficient-balance-modal.jsx';
import CompanyWideLimitExceededModal from './company-wide-limit-exceeded-modal.jsx';
import AccountVerificationRequiredModal from './account-verification-required-modal';
import AccountVerificationPendingModal from './account-verification-pending-modal';

type TServicesError = {
    code: string;
    message: string;
    type?: string;
};

type TPropServicesErrorModel = {
    is_virtual?: boolean;
    is_visible: boolean;
    is_logged_in?: boolean;
    onConfirm: () => void;
    services_error: TServicesError;
    mf_account_status: string | null;
};

const ServicesErrorModal = ({
    is_virtual,
    is_visible,
    is_logged_in,
    onConfirm,
    services_error,
    mf_account_status,
}: TPropServicesErrorModel) => {
    const { code, message, type } = services_error;

    if (!code || !message) return <React.Fragment />;
    switch (code) {
        case 'AuthorizationRequired':
            return (
                <AuthorizationRequiredModal
                    is_logged_in={is_logged_in}
                    is_visible={is_visible}
                    toggleModal={onConfirm}
                />
            );
        case 'InsufficientBalance':
            return (
                <InsufficientBalanceModal
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    // TODO: This component needs to be TS migrated so error isn't there
                    is_virtual={is_virtual}
                    is_visible={is_visible}
                    message={message}
                    toggleModal={onConfirm}
                />
            );
        case 'CompanyWideLimitExceeded':
            return <CompanyWideLimitExceededModal is_visible={is_visible} onConfirm={onConfirm} />;
        case 'PleaseAuthenticate':
            if (mf_account_status === 'pending') {
                return <AccountVerificationPendingModal is_visible={is_visible} onConfirm={onConfirm} />;
            }
            return <AccountVerificationRequiredModal is_visible={is_visible} onConfirm={onConfirm} />;
        default:
            return (
                <Modal is_open={is_visible} small title={getTitle(type)} toggleModal={onConfirm}>
                    <Modal.Body>{message}</Modal.Body>
                    <Modal.Footer>
                        <Button has_effect text={localize('OK')} onClick={onConfirm} primary />
                    </Modal.Footer>
                </Modal>
            );
    }
};

export default ServicesErrorModal;
