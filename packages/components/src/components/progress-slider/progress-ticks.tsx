import classNames from 'classnames';
import React from 'react';
import Text from '../text';

type ProgressTicksProps = {
    current_tick: number;
    ticks_count: number;
};

const ProgressTicks = ({ current_tick, getCardLabels, ticks_count }: ProgressTicksProps) => {
    const arr_ticks = [...Array(ticks_count).keys()];
    return (
        <div className='dc-progress-slider__ticks'>
            <Text styles={{ lineHeight: '18px' }} size='xxs' className='dc-progress-slider__ticks-caption'>
                {getCardLabels().TICK} {current_tick}
            </Text>
            <div className='dc-progress-slider__ticks-wrapper'>
                {arr_ticks.map(idx => (
                    <div
                        key={idx}
                        className={classNames('dc-progress-slider__ticks-step', {
                            'dc-progress-slider__ticks-step--marked': idx + 1 <= parseInt(current_tick),
                        })}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProgressTicks;
