import React from 'react';
import NumberButton, { TNumberButton } from './number-button';

const NumberGrid = ({ onSelect }: TNumberButton) => {
    return (
        <React.Fragment>
            {Array.from(new Array(10), (val, index) => index).map(n => (
                <NumberButton key={n} number={n} onSelect={onSelect} />
            ))}
        </React.Fragment>
    );
};

export default NumberGrid;
