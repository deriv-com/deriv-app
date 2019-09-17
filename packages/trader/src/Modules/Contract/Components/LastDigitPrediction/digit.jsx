import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';

const Digit = ({
    is_latest,
    is_lost,
    is_selected,
    is_won,
    percentage,
    value,
}) => {
    const display_percentage = (percentage && !isNaN(percentage)) ?
        parseFloat(percentage).toFixed(1) : null;
    return (
        <React.Fragment>
            <span
                className={classNames('digits__digit-value', {
                    'digits__digit-value--latest'  : is_latest,
                    'digits__digit-value--selected': is_selected,
                    'digits__digit-value--win'     : is_won && is_latest,
                    'digits__digit-value--loss'    : is_lost && is_latest,
                })}
            >
                <i className={classNames('digits__digit-display-value', {
                    'digits__digit-display-value--no-stats': !display_percentage,
                })}
                >
                    {value}
                </i>
                {!!(display_percentage) &&
                    <i className='digits__digit-display-percentage'>{display_percentage}%</i>
                }
            </span>
        </React.Fragment>
    );
};

Digit.propTypes = {
    is_latest    : PropTypes.bool,
    is_lost      : PropTypes.bool,
    is_selected  : PropTypes.bool,
    is_trade_page: PropTypes.bool,
    is_won       : PropTypes.bool,
    value        : PropTypes.number,
};

export default Digit;
