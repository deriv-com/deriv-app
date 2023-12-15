import React from 'react';
import { useFormikContext } from 'formik';
import { FadedAnimatedList, WalletAlertMessage } from '../../../../../../components';
import { useTransferMessages } from '../../hooks';
import { useTransfer } from '../../provider';
import { TInitialTransferFormValues } from '../../types';
import './TransferMessages.scss';

const TransferMessages = () => {
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
            {messages.map(message => (
                <WalletAlertMessage key={message.text + message.type} message={message.text} type={message.type} />
            ))}
        </FadedAnimatedList>
    );
};

export default TransferMessages;
