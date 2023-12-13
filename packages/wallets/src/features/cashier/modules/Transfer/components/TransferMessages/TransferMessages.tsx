import React from 'react';
import { useFormikContext } from 'formik';
import { FadedAnimatedList, WalletAlertMessage } from '../../../../../../components';
import { THooks } from '../../../../../../types';
import { useTransferMessages } from '../../hooks';
import { TInitialTransferFormValues } from '../../types';
import './TransferMessages.scss';

type TProps = {
    exchangeRatesUSD?: THooks.ExchangeRate;
    exchangeRatesWalletCurrency?: THooks.ExchangeRate;
};

const TransferMessages: React.FC<TProps> = ({ exchangeRatesUSD, exchangeRatesWalletCurrency }) => {
    const { values } = useFormikContext<TInitialTransferFormValues>();

    const messages = useTransferMessages(
        values.fromAccount,
        values.toAccount,
        values,
        exchangeRatesUSD,
        exchangeRatesWalletCurrency
    );

    return (
        <FadedAnimatedList className='wallets-transfer-messages'>
            {messages.map(message => (
                <WalletAlertMessage key={message.text + message.type} message={message.text} type={message.type} />
            ))}
        </FadedAnimatedList>
    );
};

export default TransferMessages;
