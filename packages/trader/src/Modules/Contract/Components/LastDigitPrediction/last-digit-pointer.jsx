import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import { Icon }   from 'deriv-components';

const LastDigitPointer = ({
    is_lost,
    is_trade_page,
    is_won,
    position,
}) => (
    <React.Fragment>
        {!!position &&
        <span
            className='digits__pointer'
            style={{ transform: `translate3d(calc(${position}px), 0, 0px)` }}
        >
            <Icon
                icon='IcProfit'
                className={classNames('digits__icon', {
                    'digits__icon--win' : is_won && !is_trade_page,
                    'digits__icon--loss': is_lost && !is_trade_page,
                })}
                green={(is_won && !is_trade_page) || undefined}
                red={(is_lost && !is_trade_page) || undefined}
                color={(is_won || is_won) ? undefined : 'var(--brand-orange)'}
            />
        </span>
        }
    </React.Fragment>
);

LastDigitPointer.propTypes = {
    is_lost : PropTypes.bool,
    is_won  : PropTypes.bool,
    position: PropTypes.number,
};

export default LastDigitPointer;
