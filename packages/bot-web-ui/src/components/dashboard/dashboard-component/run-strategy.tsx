import React from 'react';
import TradeAnimation from 'Components/trade-animation';

const RunStrategy = () => (
    <div className='toolbar__section'>
        <TradeAnimation className='toolbar__animation' should_show_overlay info_direction='left' />
    </div>
);

export default RunStrategy;
