import React from 'react';
import { formatMoney, getCurrencyDisplayCode } from '@deriv/shared';

type TMoneyProps = {
    amount: number | string;
    className: string;
    currency: string;
    has_sign: boolean;
    should_format: boolean;
    show_currency: boolean; // if true, append currency symbol
};

const Money = ({
    amount = 0,
    className,
    currency = 'USD',
    has_sign,
    should_format = true,
    show_currency = false,
}: Partial<TMoneyProps>) => {
    let sign = '';
    if (+amount && (amount < 0 || has_sign)) {
        sign = amount > 0 ? '+' : '-';
    }

    // if it's formatted already then don't make any changes unless we should remove extra -/+ signs
    const value = has_sign || should_format ? Math.abs(Number(amount)) : amount;
    const final_amount = should_format ? formatMoney(currency, value, true, 0, 0) : value;

    return (
        <React.Fragment>
            {has_sign && sign}
            <span className={className}>
                {final_amount} {show_currency && getCurrencyDisplayCode(currency)}
            </span>
        </React.Fragment>
    );
};

export default React.memo(Money);
