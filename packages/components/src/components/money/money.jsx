import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CurrencyUtils from '@deriv/shared/utils/currency';
import CryptoMoney from 'Components/crypto-money/crypto-money.jsx';

const Money = ({ amount, className, currency = 'USD', has_sign, should_format = true }) => {
    let sign = '';

    if (+amount && (amount < 0 || has_sign)) {
        sign = amount > 0 ? '+' : '-';
    }

    // if it's formatted already then don't make any changes unless we should remove extra -/+ signs
    const value = has_sign || should_format ? Math.abs(amount) : amount;
    const decimal_part = CurrencyUtils.getDecimalPart(amount);
    const needs_crypto_toggle =
        CurrencyUtils.isCryptocurrency(currency) &&
        decimal_part &&
        decimal_part.length > CurrencyUtils.getDecimalPlaces(currency);
    let final_amount = value;

    if (needs_crypto_toggle) {
        final_amount = CurrencyUtils.getCryptoFormat(value);
    } else if (should_format) {
        final_amount = CurrencyUtils.formatMoney(currency, value, true);
    }

    return (
        <React.Fragment>
            {has_sign && sign}
            <span className={classNames(className, 'symbols', `symbols--${currency.toLowerCase()}`)} />
            {needs_crypto_toggle ? (
                <CryptoMoney real_value={final_amount.real_value} toggled_value={final_amount.toggled_value} />
            ) : (
                final_amount
            )}
        </React.Fragment>
    );
};

Money.propTypes = {
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    currency: PropTypes.string,
    has_sign: PropTypes.bool,
    should_format: PropTypes.bool,
};

export default React.memo(Money);
