import React, { useState } from 'react';
import Button              from '../button';
import Icon                from '../icon';

const TickPicker = ({ min_value, max_value, onSubmit, submit_label }) => {
    const normalizedTick = (tick) => `${tick}`.padStart(2, 0);
    const [tick_value, setTickValue] = useState(parseInt(min_value));

    const handleDecrease = () => {
        if (tick_value - 1 >= min_value) {
            setTickValue(tick_value - 1);
        }
        
    };
    const handleIncrease = () => {
        if (tick_value + 1 <= max_value) {
            setTickValue(tick_value + 1);
        }
        
    };
    const handleClick = () => {
        onSubmit({
            target: {
                value: tick_value,
                name : 'submit',
            },
        });
    };
    return (
        <div className='dc-tick-picker'>
            <div className='dc-tick-picker__calculation'>
                <Button circular className='operator' onClick={handleDecrease}>
                    <Icon icon='IcMinus' custom_color='var(--text-prominent)' />
                </Button>
                <div className='tick-holder'>
                    <span className='tick-holder__counter'>{normalizedTick(tick_value)}</span>
                    <span className='tick-holder__text'>Ticks</span>
                </div>
                <Button circular className='operator' onClick={handleIncrease}>
                    <Icon icon='IcAdd' custom_color='var(--text-prominent)' />
                </Button>
            </div>
            <div className='dc-tick-picker__submit-wrapper'>
                <Button circular className='styled-button' onClick={handleClick}>{submit_label}</Button>
            </div>
        </div>
    );
};

export default TickPicker;
