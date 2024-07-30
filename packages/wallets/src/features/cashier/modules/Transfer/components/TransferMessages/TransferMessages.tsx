import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FadedAnimatedList, WalletAlertMessage, WalletButton } from '../../../../../../components';
import { useTransferMessages } from '../../hooks';
import { useTransfer } from '../../provider';
import { TInitialTransferFormValues } from '../../types';
import './TransferMessages.scss';

const TransferMessages: React.FC = () => {
    const { setFieldValue, values } = useFormikContext<TInitialTransferFormValues>();

    const { USDExchangeRates, accountLimits, activeWalletExchangeRates } = useTransfer();

    const messages = useTransferMessages({
        accountLimits,
        activeWalletExchangeRates,
        formData: values,
        fromAccount: values.fromAccount,
        toAccount: values.toAccount,
        USDExchangeRates,
    });

    useEffect(() => {
        const hasErrorMessage = messages.some(message => message.type === 'error');
        setFieldValue('isError', hasErrorMessage);
    }, [messages, setFieldValue]);

    return (
        <FadedAnimatedList className='wallets-transfer-messages'>
            {messages.map(({ action, message: { text, values }, type }) => {
                const message = <Trans defaults={text} values={values} />;

                return (
                    <WalletAlertMessage key={text} message={message} type={type}>
                        {action?.buttonLabel && action?.navigateTo && (
                            <div className='wallets-transfer-messages__action-button'>
                                <WalletButton size='sm' type='button' variant='contained'>
                                    <Link
                                        className='wallets-transfer-messages__link'
                                        to={action.navigateTo}
                                        {...(action?.shouldOpenInNewTab && {
                                            rel: 'noopener noreferrer',
                                            target: '_blank',
                                        })}
                                    >
                                        <Trans defaults={action.buttonLabel} />
                                    </Link>
                                </WalletButton>
                            </div>
                        )}
                    </WalletAlertMessage>
                );
            })}
        </FadedAnimatedList>
    );
};

export default TransferMessages;
