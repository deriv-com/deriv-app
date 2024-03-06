import React, { useEffect, useState } from 'react';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { useFormikContext } from 'formik';
import { Text } from '@deriv-com/ui';
import { PercentageSelector } from '../../../../../../components';
import styles from './TransferPercentageSelector.module.scss';

const TransferPercentageSelector = () => {
    const { errors, setValues, values } = useFormikContext();
    const [percentage, setPercentage] = useState<number>(0);

    const getAmount = () => {
        const amount = parseFloat(values.fromAmount);

        if (!values.fromAmount || Number.isNaN(amount)) return 0;

        return amount;
    };

    useEffect(() => {
        setPercentage(Math.floor((getAmount() * 100) / values.fromAccount.balance));
    }, [values.fromAmount]);

    return (
        <div className={styles.container}>
            <PercentageSelector
                amount={getAmount()}
                balance={values.fromAccount.balance}
                onChangePercentage={per => {
                    setValues(currentValues => ({
                        ...currentValues,
                        fromAmount: (values.fromAccount.balance * per) / 100,
                    }));
                    setPercentage(per);
                }}
            />
            <Text align='center' color='less-prominent' size='xs'>
                {percentage}% of available balance (
                {displayMoney(values.fromAccount.balance, values.fromAccount.currency, {
                    fractional_digits: values.fromAccount.currencyConfig.fractional_digits,
                })}
                )
            </Text>
        </div>
    );
};

export default TransferPercentageSelector;
