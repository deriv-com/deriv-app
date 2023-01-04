import React from 'react';
import TickProgress from '../tick-progress';
import Text from '../text';

type TProgressTicksMobileProps = {
    current_tick: number;
    ticks_count: number;
    getCardLabels: () => { [key: string]: string }; // TODO Use the one from shared workspace after migration
};

const ProgressTicksMobile = ({ current_tick, getCardLabels, ticks_count }: TProgressTicksMobileProps) => {
    return (
        <div className='dc-progress-slider__ticks'>
            <Text styles={{ lineHeight: '18px' }} size='xxs' className='dc-progress-slider__ticks-caption'>
                {getCardLabels().TICK} {current_tick}
            </Text>
            <TickProgress columns={5} rows={ticks_count > 5 ? 2 : 1} size={ticks_count} value={current_tick} />
        </div>
    );
};

export default ProgressTicksMobile;
