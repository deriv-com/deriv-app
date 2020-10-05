import PropTypes from 'prop-types';
import React from 'react';
import { formatMoney, getCurrencyDisplayCode } from '@deriv/shared';

const Money = ({ amount, className, currency = 'USD', has_sign, should_format = true, show_currency = false }) => {
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

Money.propTypes = {
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    currency: PropTypes.string,
    has_sign: PropTypes.bool,
    should_format: PropTypes.bool,
    show_currency: PropTypes.bool, // if true, append currency symbol
};

export default React.memo(Money);
