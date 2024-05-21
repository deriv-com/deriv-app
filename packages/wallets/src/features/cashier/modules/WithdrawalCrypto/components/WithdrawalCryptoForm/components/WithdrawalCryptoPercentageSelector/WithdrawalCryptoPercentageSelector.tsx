import React from 'react';
import { useFormikContext } from 'formik';
import { WalletsPercentageSelector, WalletText } from '../../../../../../../../components';
import { useWithdrawalCryptoContext } from '../../../../provider';
import { TWithdrawalForm } from '../../../../types';
import { validateCryptoInput, validateFiatInput } from '../../../../utils';
import './WithdrawalCryptoPercentageSelector.scss';

const WithdrawalCryptoPercentageSelector: React.FC = () => {
    const { setValues, values } = useFormikContext<TWithdrawalForm>();
    const { accountLimits, activeWallet, cryptoConfig, fractionalDigits, getConvertedFiatAmount, isClientVerified } =
        useWithdrawalCryptoContext();

    const getPercentageMessage = (value: string) => {
        const amount = parseFloat(value);
        if (!activeWallet?.balance || !activeWallet.display_balance) return;

        if (amount <= activeWallet.balance) {
            const percentage = Math.round((amount * 100) / activeWallet.balance);
            return `${percentage}% of available balance (${activeWallet.display_balance})`;
        }
    };

    const isValidInput =
        !validateCryptoInput(
            activeWallet,
            fractionalDigits,
            isClientVerified,
            accountLimits?.remainder ?? 0,
            values.cryptoAmount,
            cryptoConfig?.minimum_withdrawal
        ) && !validateFiatInput(fractionalDigits, values.fiatAmount);

    return (
        <div className='wallets-withdrawal-crypto-percentage__selector'>
            <WalletsPercentageSelector
                amount={
                    activeWallet?.balance &&
                    !Number.isNaN(parseFloat(values.cryptoAmount)) &&
                    parseFloat(values.cryptoAmount) <= activeWallet.balance
                        ? parseFloat(values.cryptoAmount)
                        : 0
                }
                balance={activeWallet?.balance ?? 0}
                onChangePercentage={percentage => {
                    if (activeWallet?.balance) {
                        const fraction = percentage / 100;
                        const cryptoAmount = (activeWallet.balance * fraction).toFixed(fractionalDigits.crypto);
                        const fiatAmount = !validateCryptoInput(
                            activeWallet,
                            fractionalDigits,
                            isClientVerified,
                            accountLimits?.remainder ?? 0,
                            cryptoAmount,
                            cryptoConfig?.minimum_withdrawal
                        )
                            ? getConvertedFiatAmount(cryptoAmount)
                            : '';

                        return setValues({
                            ...values,
                            cryptoAmount,
                            fiatAmount,
                        });
                    }
                }}
            />
            <div className='wallets-withdrawal-crypto-percentage__message'>
                <WalletText color='less-prominent' size='xs'>
                    {isValidInput && getPercentageMessage(values.cryptoAmount)}
                </WalletText>
            </div>
        </div>
    );
};

export default WithdrawalCryptoPercentageSelector;
