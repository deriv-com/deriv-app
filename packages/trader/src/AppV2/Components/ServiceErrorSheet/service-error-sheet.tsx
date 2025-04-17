import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { isEmptyObject, redirectToLogin, redirectToSignUp, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { getLanguage, Localize } from '@deriv/translations';
import { ActionSheet } from '@deriv-com/quill-ui';

import { checkIsServiceModalError, SERVICE_ERROR } from 'AppV2/Utils/layout-utils';
import { useTraderStore } from 'Stores/useTraderStores';

import ServiceErrorDescription from './service-error-description';

const ServiceErrorSheet = observer(() => {
    const [is_open, setIsOpen] = useState(false);
    const { common, client, ui } = useStore();
    const { is_mf_verification_pending_modal_visible, setIsMFVericationPendingModal } = ui;
    const { has_wallet, is_virtual } = client;
    const { services_error, resetServicesError } = common;
    const { clearPurchaseInfo, requestProposal: resetPurchase } = useTraderStore();
    const history = useHistory();

    const { code, message, type } = services_error || {};
    const is_insufficient_balance = code === SERVICE_ERROR.INSUFFICIENT_BALANCE;
    const is_authorization_required = code === SERVICE_ERROR.AUTHORIZATION_REQUIRED && type === 'buy';
    const is_account_verification_required = code === SERVICE_ERROR.PLEASE_AUTHENTICATE;
    const should_show_error_modal =
        (!isEmptyObject(services_error) || is_mf_verification_pending_modal_visible) &&
        checkIsServiceModalError({ services_error, is_mf_verification_pending_modal_visible });

    const onClose = () => {
        setIsOpen(false);
        if (services_error.type === 'buy') {
            if (is_insufficient_balance) {
                return;
            }
            clearPurchaseInfo();
            resetPurchase();
        }
    };

    const getActionButtonProps = () => {
        if (is_insufficient_balance) {
            return {
                primaryAction: {
                    content: <Localize i18n_default_text='Deposit now' />,
                    onAction: () => {
                        resetServicesError();
                        if (!is_virtual) {
                            localStorage.setItem('redirect_to_th_os', 'wallet');
                            history?.push?.(has_wallet ? routes.wallets_deposit : routes.cashier_deposit);
                        } else {
                            onClose();
                        }
                    },
                },
            };
        }
        if (is_authorization_required) {
            return {
                primaryAction: {
                    content: <Localize i18n_default_text='Create free account' />,
                    onAction: () => {
                        resetServicesError();
                        redirectToSignUp();
                    },
                },
                secondaryAction: {
                    content: <Localize i18n_default_text='Login' />,
                    onAction: () => {
                        resetServicesError();
                        redirectToLogin(false, getLanguage());
                    },
                },
            };
        }
        if (is_account_verification_required) {
            return {
                primaryAction: {
                    content: <Localize i18n_default_text='Submit Proof' />,
                    onAction: () => {
                        resetServicesError();
                        history.push(routes.proof_of_identity);
                    },
                },
            };
        }
        if (is_mf_verification_pending_modal_visible) {
            return {
                primaryAction: {
                    content: <Localize i18n_default_text='Got it' />,
                    onAction: () => {
                        resetServicesError();
                        setIsMFVericationPendingModal(false);
                        onClose();
                    },
                },
            };
        }
    };

    const getErrorType = () => {
        if (is_insufficient_balance) return SERVICE_ERROR.INSUFFICIENT_BALANCE;
        if (is_authorization_required) return SERVICE_ERROR.AUTHORIZATION_REQUIRED;
        if (is_account_verification_required) return SERVICE_ERROR.PLEASE_AUTHENTICATE;
        if (is_mf_verification_pending_modal_visible) return SERVICE_ERROR.PENDING_VERIFICATION;
        return null;
    };

    useEffect(() => {
        setIsOpen(should_show_error_modal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [should_show_error_modal]);

    useEffect(() => {
        if (!is_open && code) resetServicesError();
        if (!is_open) setIsMFVericationPendingModal(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_open]);

    if (!should_show_error_modal) return null;

    return (
        <ActionSheet.Root
            className='service-error-sheet'
            isOpen={is_open}
            onClose={onClose}
            expandable={false}
            position='left'
        >
            <ActionSheet.Portal showHandlebar shouldCloseOnDrag>
                <div className='service-error-sheet__body'>
                    <ServiceErrorDescription error_type={getErrorType()} services_error_message={message} />
                </div>
                <ActionSheet.Footer
                    className='service-error-sheet__footer'
                    alignment='vertical'
                    primaryButtonColor='coral'
                    {...getActionButtonProps()}
                />
            </ActionSheet.Portal>
        </ActionSheet.Root>
    );
});

export default ServiceErrorSheet;
