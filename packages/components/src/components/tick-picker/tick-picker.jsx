import React, { useState } from 'react';
import Button from '../button';
import Icon from '../icon';

const TickPicker = ({ min_value, max_value, onSubmit, label }) => {
    const normalizedTick = (tick) => ((parseInt(tick) < 10 ? "0" : "") + tick)
    const [tick_value, setTickValue] = useState(parseInt(min_value));

    const handleDecrease = () => {
        if (tick_value - 1 >= min_value) {
            setTickValue(tick_value - 1)
        }
        return
    }
    const handleIncrease = () => {
        if (tick_value + 1 <= max_value) {
            setTickValue(tick_value + 1)
        }
        return
    }
    const handleClick = () => {
        onSubmit({
            target: {
                value: tick_value,
                name: 'submit'
            }
        })
    }
    return (
        <div className='tick-picker'>
            <div className='tick-picker--calculation'>
                <Button curved className='operator' onClick={handleDecrease}>
                    <Icon icon='IcMinus' color='active' />
                </Button>
                <div className='tick-holder'>
                    <span className='tick-holder--counter'>{normalizedTick(tick_value)}</span>
                    <span className='tick-holder--text'>Ticks</span>
                </div>
                <Button curved className='operator' onClick={handleIncrease}>
                    <Icon icon='IcAdd' color='active' />
                </Button>
            </div>
            <div className='tick-picker--submit-wrapper'>
                <Button curved className='styled-button' onClick={handleClick}>{label}</Button>
            </div>
        </div>
    );
};

export default TickPicker;
