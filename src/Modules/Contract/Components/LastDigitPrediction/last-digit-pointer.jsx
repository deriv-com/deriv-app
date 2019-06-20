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
            icon='IconPriceMove'
            className={classNames('digits__icon', {
                'digits__icon--win' : is_won,
                'digits__icon--loss': is_lost,
            })}
            classNamePath='digits__icon-color'
            type='profit'
        />
    </span>
);

LastDigitPointer.propTypes = {
    is_lost : PropTypes.bool,
    is_won  : PropTypes.bool,
    position: PropTypes.number,
};

export default LastDigitPointer;
