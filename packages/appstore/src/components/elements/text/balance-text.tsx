import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { useStores } from 'Stores';
import './balance-text.scss';

// Todo: this definitely needs to be somewhere else
type Size = 'xxxxs' | 'xxxs' | 'xxs' | 'xs' | 's' | 'xsm' | 'sm' | 'm' | 'l' | 'xl' | 'xxl';

type BalanceTextProps = {
    balance: number;
    currency: string;
    size?: Size;
    underline_style?: 'dotted' | 'solid' | 'none';
};

const BalanceText = ({ balance, currency, size = 'm', underline_style = 'none' }: BalanceTextProps) => {
    const { client, traders_hub } = useStores();
    const { selected_account_type } = traders_hub;
    const { has_active_real_account } = client;

    const getTextClassName = () => {
        if (selected_account_type === 'demo') {
            return has_active_real_account ? 'balance-text__text--demo' : 'balance-text__text--amount';
        }
        if (selected_account_type === 'real') {
            return has_active_real_account ? 'balance-text__text--real' : 'balance-text__text--no-amount';
        }
        return '';
    };

    return (
        <div
            className={classNames('balance-text__container', { 'balance-text--dotted': underline_style === 'dotted' })}
        >
            <Text weight='bold' size={size} className={getTextClassName()}>
                {formatMoney(currency, balance, true)}
            </Text>
            <Text weight='bold' size={size} color='prominent' className={getTextClassName()}>
                {currency}
            </Text>
        </div>
    );
};

export default BalanceText;
