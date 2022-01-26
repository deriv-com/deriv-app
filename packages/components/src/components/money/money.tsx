import React from 'react';
import { formatMoney, getCurrencyDisplayCode } from '@deriv/shared';

type MoneyProps = {
    amount: unknown | number | string;
    className: string;
    currency: string;
    has_sign: boolean;
    should_format: boolean;
    show_currency: boolean;
};

const Money = ({
    amount,
    className,
    currency = 'USD',
    has_sign,
    should_format = true,
    show_currency = false,
}: MoneyProps) => {
    let sign = '';
    if (+amount && (amount < 0 || has_sign)) {
        sign = amount > 0 ? '+' : '-';
    }

    // if it's formatted already then don't make any changes unless we should remove extra -/+ signs
    const value = has_sign || should_format ? Math.abs(amount) : amount;
    const final_amount = should_format ? formatMoney(currency, value, true) : value;

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
