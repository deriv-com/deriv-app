import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import Icon       from 'Assets/icon.jsx';

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
                icon='IconPriceMove'
                className={classNames('digits__icon', {
                    'digits__icon--win' : is_won && !is_trade_page,
                    'digits__icon--loss': is_lost && !is_trade_page,
                })}
                classNamePath='digits__icon-color'
                type='profit'
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
