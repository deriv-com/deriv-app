import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';

const Digit = ({
    is_latest,
    is_lost,
    is_selected,
    is_trade_page,
    is_won,
    value,
}) => (
    <span
        className={classNames('digits__digit-value', {
            'digits__digit-value--latest'  : is_latest,
            'digits__digit-value--selected': is_selected,
            'digits__digit-value--blink'   : is_won && is_latest && is_trade_page,
            'digits__digit-value--win'     : is_won && is_latest,
            'digits__digit-value--loss'    : is_lost && is_latest,
        })}
    >
        {value}
    </span>
);

Digit.propTypes = {
    is_latest    : PropTypes.bool,
    is_lost      : PropTypes.bool,
    is_selected  : PropTypes.bool,
    is_trade_page: PropTypes.bool,
    is_won       : PropTypes.bool,
    value        : PropTypes.number,
};

export default Digit;
