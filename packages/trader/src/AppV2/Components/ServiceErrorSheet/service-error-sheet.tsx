import React, { useEffect, useState } from 'react';
import { observer, useStore } from '@deriv/stores';
import { ActionSheet, Text } from '@deriv-com/quill-ui';
import { getLanguage, Localize } from '@deriv/translations';
import { redirectToLogin } from '@deriv/shared';
import { useSignupHandler } from 'AppV2/Hooks/useSignUpHandler';
import './service-error-sheet.scss';
import { useHistory } from 'react-router';

const ServiceErrorSheet = observer(() => {
    const [is_open, setIsOpen] = useState(false);
    const { common } = useStore();
    const { services_error, resetServicesError } = common;
    const { handleSignup } = useSignupHandler();
    const history = useHistory();

    const is_insufficient_balance =
        services_error.code === 'InsufficientBalance' || services_error.code === 'InvalidContractProposal';
    const is_authorization_required = services_error.code === 'AuthorizationRequired' && services_error.type === 'buy';

    useEffect(() => {
        if (is_insufficient_balance || is_authorization_required) {
            setIsOpen(true);
        }
    }, [services_error]);

    useEffect(() => {
        if (!is_open && services_error.code) {
            resetServicesError();
        }
    }, [resetServicesError, is_open]);

    const renderContent = () => {
        if (is_insufficient_balance) {
            return (
                <>
                    <Text size='lg' bold className='service-error-sheet__body__heading'>
                        <Localize i18n_default_text='Insufficient balance' />
                    </Text>
                    <Text>{services_error.message}</Text>
                </>
            );
        }

        if (is_authorization_required) {
            return (
                <>
                    <Text size='lg' bold className='service-error-sheet__body__heading'>
                        <Localize i18n_default_text='Start trading with us' />
                    </Text>
                    <Text>
                        <Localize i18n_default_text='Log in or create a free account to place a trade.' />
                    </Text>
                </>
            );
        }

        return null;
    };

    return (
        <ActionSheet.Root
            className='service-error-sheet'
            isOpen={is_open}
            onClose={() => {
                if (services_error.code) {
                    setIsOpen(false);
                }
            }}
            expandable={false}
            position='left'
        >
            <ActionSheet.Portal showHandlebar shouldCloseOnDrag>
                <div className='service-error-sheet__body'>{renderContent()}</div>
                <ActionSheet.Footer
                    className='service-error-sheet__footer'
                    alignment='vertical'
                    {...(is_insufficient_balance
                        ? {
                              primaryAction: {
                                  content: <Localize i18n_default_text='Deposit now' />,
                                  onAction: () => {
                                      resetServicesError();
                                      history.push('/cashier/deposit');
                                  },
                              },
                              primaryButtonColor: 'coral',
                          }
                        : {})}
                    {...(is_authorization_required
                        ? {
                              primaryAction: {
                                  content: <Localize i18n_default_text='Create free account' />,
                                  onAction: () => {
                                      resetServicesError();
                                      handleSignup();
                                  },
                              },
                              primaryButtonColor: 'coral',
                              secondaryAction: {
                                  content: <Localize i18n_default_text='Login' />,
                                  onAction: () => {
                                      resetServicesError();
                                      redirectToLogin(false, getLanguage());
                                  },
                              },
                          }
                        : {})}
                />
            </ActionSheet.Portal>
        </ActionSheet.Root>
    );
});

export default ServiceErrorSheet;
