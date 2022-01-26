import classNames from 'classnames';
import React from 'react';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';
import TickSteps from './tick-steps.jsx';

type RangeSliderProps = {
    className: string;
    max_value: number;
    min_value: number;
    name: string;
    onChange: () => void;
    value: number;
};

const RangeSlider = ({ className, name, value, min_value, max_value, onChange }: RangeSliderProps) => {
    const [hover_value, setHoverValue] = React.useState(0);
    const range_slider_ref = React.useRef();

    const handleChange = e => {
        const target_value = +e.target.value;
        if (target_value !== value) {
            resetOnHover();
            onChange({ target: { name, value: target_value } });
        }
    };

    const handleClick = index => {
        if (index !== value) {
            resetOnHover();
            onChange({ target: { name, value: index } });
        }
    };

    const onMouseEnter = index => {
        if (index) {
            setHoverValue(index);
            range_slider_ref.current.style.width = getRangeSliderTrackWidth(index, true);
        }
    };

    const onMouseLeave = e => {
        const { offsetX, offsetY } = e.nativeEvent;
        if (offsetY <= -3 || offsetY >= 3 || offsetX < -3 || offsetX > 3) {
            resetOnHover();
        }
    };

    const getRangeSliderTrackWidth = (slider_value, is_hover) => {
        const width = (slider_value - min_value) * (10 / (max_value - min_value));
        return `${width * 2 + (is_hover ? 0.8 : 1.4)}em`;
    };

    const resetOnHover = () => {
        if (hover_value) {
            setHoverValue(0);
            range_slider_ref.current.style.width = 0;
        }
    };

    const display_value = hover_value || value;
    const steps = !isNaN(max_value - min_value) ? max_value - min_value : 10;
    return (
        <div
            className={classNames('range-slider', className, {
                'range-slider__error': value < min_value || value > max_value,
            })}
        >
            <label className='range-slider__label' htmlFor='range'>
                <input
                    className='input trade-container__input range-slider__track'
                    id='dt_duration_range_input'
                    max={max_value}
                    max_value={max_value}
                    min={min_value}
                    min_value={min_value}
                    name={name}
                    onChange={handleChange}
                    tabIndex='0'
                    type='range'
                    steps={steps}
                    value={value}
                    aria-label='range-input'
                />
                {/* this element to be placed before <TickSteps /> to prevent overlapping colors */}
                <span
                    ref={range_slider_ref}
                    className='range-slider__line range-slider__line--fill'
                    onMouseLeave={onMouseLeave}
                />
                <div className='range-slider__ticks'>
                    <TickSteps
                        hover_value={hover_value}
                        max_value={max_value}
                        min_value={min_value}
                        onClick={handleClick}
                        onMouseLeave={onMouseLeave}
                        onMouseEnter={onMouseEnter}
                        value={value}
                    />
                </div>
                {/* Calculate line width based on active value and size of range thumb */}
                <div className='range-slider__line' style={{ width: `${getRangeSliderTrackWidth(value)}` }} />
            </label>
            <div className='range-slider__caption'>
                {!!display_value && (
                    <Text align='center' weight='bold' size='xs' color='prominent' id='dt_range_slider_label'>
                        {display_value === 1 && localize('{{display_value}} Tick', { display_value })}
                        {display_value > 1 && localize('{{display_value}} Ticks', { display_value })}
                    </Text>
                )}
            </div>
        </div>
    );
};

export default RangeSlider;
