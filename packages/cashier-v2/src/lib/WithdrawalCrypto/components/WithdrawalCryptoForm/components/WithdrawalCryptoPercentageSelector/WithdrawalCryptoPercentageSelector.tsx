import React from 'react';
import { useFormikContext } from 'formik';
import { Text } from '@deriv-com/ui';
import { PercentageSelector } from '../../../../../../components/PercentageSelector';
import { useWithdrawalCryptoContext } from '../../../../provider';
import { TWithdrawalForm } from '../../../../types';
import { validateCryptoInput, validateFiatInput } from '../../../../utils';
import styles from './WithdrawalCryptoPercentageSelector.module.scss';

const WithdrawalCryptoPercentageSelector: React.FC = () => {
    const { setValues, values } = useFormikContext<TWithdrawalForm>();
    const { accountLimits, activeAccount, cryptoConfig, fractionalDigits, getConvertedFiatAmount, isClientVerified } =
        useWithdrawalCryptoContext();

    const getPercentageMessage = (value: string) => {
        const amount = parseFloat(value);
        if (!activeAccount?.balance || !activeAccount.display_balance) return;

        if (amount <= activeAccount.balance) {
            const percentage = Math.round((amount * 100) / activeAccount.balance);
            return `${percentage}% of available balance (${activeAccount.display_balance})`;
        }
    };

    const isValidInput =
        !validateCryptoInput(
            activeAccount,
            fractionalDigits,
            isClientVerified,
            accountLimits?.remainder ?? 0,
            values.cryptoAmount,
            cryptoConfig?.minimum_withdrawal
        ) && !validateFiatInput(fractionalDigits, values.fiatAmount);

    const onChangePercentage = (percentage: number) => {
        if (activeAccount?.balance) {
            const fraction = percentage / 100;
            const cryptoAmount = (activeAccount.balance * fraction).toFixed(fractionalDigits.crypto);
            const fiatAmount = !validateCryptoInput(
                activeAccount,
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
    };

    const percentageAmount =
        activeAccount?.balance &&
        !Number.isNaN(parseFloat(values.cryptoAmount)) &&
        parseFloat(values.cryptoAmount) <= activeAccount.balance
            ? parseFloat(values.cryptoAmount)
            : 0;

    return (
        <div className={styles['percentage-selector']}>
            <PercentageSelector
                amount={percentageAmount}
                balance={activeAccount?.balance ?? 0}
                onChangePercentage={onChangePercentage}
            />
            <div className={styles['percentage-message']}>
                <Text color='less-prominent' size='xs'>
                    {isValidInput && getPercentageMessage(values.cryptoAmount)}
                </Text>
            </div>
        </div>
    );
};

export default WithdrawalCryptoPercentageSelector;
