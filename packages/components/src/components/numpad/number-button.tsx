import classNames from 'classnames';
import React from 'react';
import Button from '../button/button';
import Text from '../text';

export type TNumberButton = {
    onSelect: (num: number | string) => void;
    number: number;
    className?: string;
};

const NumberButton = ({ onSelect, className, number }: TNumberButton) => (
    <Button
        className={classNames('dc-numpad__number', className, {
            'dc-numpad__number--zero': number === 0,
            'dc-numpad__number--r3': number > 6 && number < 10,
            'dc-numpad__number--r2': number > 3 && number < 7,
            'dc-numpad__number--r1': number > 0 && number < 4,
        })}
        type='button'
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

export default NumberButton;
