import React from 'react';
import Button from '../button'

const TickPicker = () => {
    return (
        <div className='tick-picker'>
            <div className='tick-picker--calculation'>
                first child
            </div>
            <div className='tick-picker--submit-wrapper'>
                <Button>OK</Button>
            </div>
        </div>
    );
};

export default TickPicker;
