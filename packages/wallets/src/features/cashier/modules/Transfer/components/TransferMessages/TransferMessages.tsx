import React from 'react';
import { useFormikContext } from 'formik';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FadedAnimatedList, WalletAlertMessage, WalletButton } from '../../../../../../components';
import { useTransferMessages } from '../../hooks';
import { useTransfer } from '../../provider';
import { TInitialTransferFormValues } from '../../types';
import { TransferMessagesConfig, TTransferMessagesKeys } from './TransferMessagesConfig';
import './TransferMessages.scss';

const VerifyPOIButton: React.FC = () => {
    return (
        <WalletButton size='sm' type='button' variant='contained'>
            <Link
                className='wallets-transfer-messages__link'
                rel='noopener noreferrer'
                target='_blank'
                to='/account/proof-of-identity'
            >
                <Trans defaults='Verify' />
            </Link>
        </WalletButton>
    );
};

const shouldVerifyIdentity = (key: TTransferMessagesKeys) =>
    [
        'LIFETIME_TRANSFER_LIMIT_AVAILABLE_CRYPTO',
        'LIFETIME_TRANSFER_LIMIT_AVAILABLE_CRYPTO_AND_FIAT',
        'LIFETIME_TRANSFER_LIMIT_REACHED',
    ].includes(key);

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
            {messages.map(({ key, type, values }) => {
                const message = TransferMessagesConfig[key]({ ...values });

                return (
                    <WalletAlertMessage key={key} message={message} type={type}>
                        {shouldVerifyIdentity(key) && <VerifyPOIButton />}
                    </WalletAlertMessage>
                );
            })}
        </FadedAnimatedList>
    );
};

export default TransferMessages;
