import React from 'react';
import TradeAnimation from 'Components/trade-animation';

const RunStrategy = () => (
    <div className='toolbar__section' data-testid='dt_run_strategy'>
        <TradeAnimation className='toolbar__animation' should_show_overlay info_direction='left' />
    </div>
);

export default RunStrategy;
