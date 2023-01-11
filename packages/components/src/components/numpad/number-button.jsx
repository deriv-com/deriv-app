import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/button';
import Text from '../text';

const NumberButton = ({ onSelect, className, number }) => (
    <Button
        className={classNames('dc-numpad__number', className, {
            'dc-numpad__number--zero': number === 0,
            'dc-numpad__number--r3': number > 6 && number < 10,
            'dc-numpad__number--r2': number > 3 && number < 7,
            'dc-numpad__number--r1': number > 0 && number < 4,
        })}
        type='secondary'
        classNameSpan='dc-numpad__number--is-left-aligned'
        has_effect
        onClick={() => onSelect(number)}
        text={String(number)}
        renderText={text => (
            <Text styles={{ fontSize: '1.8rem' }} weight='bold' align='center'>
                {text}
            </Text>
        )}
    />
);

NumberButton.propTypes = {
    className: PropTypes.oneOf([PropTypes.string, PropTypes.object]),
    number: PropTypes.number,
    onSelect: PropTypes.func,
};

export default NumberButton;
