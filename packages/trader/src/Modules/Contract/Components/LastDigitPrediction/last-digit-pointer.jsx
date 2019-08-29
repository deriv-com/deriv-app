import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import Icon       from 'Assets/icon.jsx';

const LastDigitPointer = ({
    is_lost,
    is_won,
    position,
}) => (
    <span
        className='digits__pointer'
        style={{ marginLeft: position }}
    >
        <Icon
            icon='IconProfit'
            className={classNames('digits__icon', {
                'digits__icon--win' : is_won,
                'digits__icon--loss': is_lost,
            })}
        />
    </span>
);

LastDigitPointer.propTypes = {
    is_lost : PropTypes.bool,
    is_won  : PropTypes.bool,
    position: PropTypes.number,
};

export default LastDigitPointer;
