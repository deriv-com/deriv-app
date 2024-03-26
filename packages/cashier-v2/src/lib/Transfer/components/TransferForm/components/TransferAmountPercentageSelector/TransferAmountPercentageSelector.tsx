import React from 'react';
import { useFormikContext } from 'formik';
import { TTransferFormikContext } from 'src/lib/Transfer/types';
import { Text } from '@deriv-com/ui';
import { PercentageSelector } from '../../../../../../components';
import styles from './TransferAmountPercentageSelector.module.scss';

const TransferAmountPercentageSelector = () => {
    const { setValues, values } = useFormikContext<TTransferFormikContext>();

    const onChange = (per: number) => {
        setValues(currentValues => ({
            ...currentValues,
            fromAmount:
                ((Number(currentValues.fromAccount.balance) * per) / 100).toFixed(
                    currentValues.fromAccount.currencyConfig?.fractional_digits
                ) ?? 0,
        }));
    };

    return (
        <div className={styles.container}>
            <PercentageSelector
                amount={Number(values.fromAmount) ?? 0}
                balance={Number(values.fromAccount.balance) ?? 0}
                onChangePercentage={onChange}
            />
            <Text color='less-prominent' size='xs'>
                % of available balance ({values.fromAccount.balance})
            </Text>
        </div>
    );
};

export default TransferAmountPercentageSelector;
