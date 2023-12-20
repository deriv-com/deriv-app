import React from 'react';
import { useFormikContext } from 'formik';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FadedAnimatedList, WalletAlertMessage, WalletButton } from '../../../../../../components';
import { useTransferMessages } from '../../hooks';
import { useTransfer } from '../../provider';
import { TInitialTransferFormValues } from '../../types';
import './TransferMessages.scss';

const TransferMessages: React.FC = () => {
    const { values } = useFormikContext<TInitialTransferFormValues>();

    const { USDExchangeRates, accountLimits, activeWalletExchangeRates } = useTransfer();

    const messages = useTransferMessages({
        accountLimits,
        activeWalletExchangeRates,
        formData: values,
        fromAccount: values.fromAccount,
        toAccount: values.toAccount,
        USDExchangeRates,
    });

    return (
        <FadedAnimatedList className='wallets-transfer-messages'>
            {messages.map(({ action, text, type, values }) => {
                const message = <Trans defaults={text} values={values} />;

                return (
                    <WalletAlertMessage key={text} message={message} type={type}>
                        {action?.buttonLabel && action?.navigateTo && (
                            <WalletButton size='sm' type='button' variant='contained'>
                                <Link
                                    className='wallets-transfer-messages__link'
                                    to={action.navigateTo}
                                    {...(action?.openInNewTab && { rel: 'noopener noreferrer', target: '_blank' })}
                                >
                                    <Trans defaults={action.buttonLabel} />
                                </Link>
                            </WalletButton>
                        )}
                    </WalletAlertMessage>
                );
            })}
        </FadedAnimatedList>
    );
};

export default TransferMessages;
