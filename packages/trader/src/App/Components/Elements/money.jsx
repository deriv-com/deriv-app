import classNames      from 'classnames';
import PropTypes       from 'prop-types';
import React           from 'react';
import { formatMoney } from '_common/base/currency_base';

const Money = ({
    amount,
    className,
    currency = 'USD',
    has_sign,
    is_formatted = true,
}) => {
    let sign = '';
    if (+amount && (amount < 0 || has_sign)) {
        sign = amount > 0 ? '+' : '-';
    }

    const abs_value = Math.abs(amount);
    const final_amount = is_formatted ? formatMoney(currency, abs_value, true) : abs_value;

    return (
        <React.Fragment>
            {has_sign && sign}
            <span className={classNames(className, 'symbols', `symbols--${currency.toLowerCase()}`)} />
            {final_amount}
        </React.Fragment>
    );
};

Money.propTypes = {
    amount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    className   : PropTypes.string,
    currency    : PropTypes.string,
    has_sign    : PropTypes.bool,
    is_formatted: PropTypes.bool,
};

export default Money;
