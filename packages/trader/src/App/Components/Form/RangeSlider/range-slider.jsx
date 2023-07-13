import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';
import TickSteps from './tick-steps.jsx';

const RangeSlider = ({ className, name, value, min_value, max_value, onChange }) => {
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
                    min={min_value}
                    name={name}
                    onChange={handleChange}
                    tabIndex='0'
                    type='range'
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
// Keypress events do not trigger on Safari due to the way it handles input type='range' elements, using focus on the input element also doesn't work for Safari.

RangeSlider.propTypes = {
    className: PropTypes.string,
    max_value: PropTypes.number,
    min_value: PropTypes.number,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.number,
};

export default RangeSlider;
