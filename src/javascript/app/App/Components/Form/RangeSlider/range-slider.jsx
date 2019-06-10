import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'App/i18n';
import { connect }  from 'Stores/connect';
import TickSteps    from './tick-steps.jsx';

const RangeSlider = ({
    className,
    max_value,
    min_value,
    name,
    value,
    onChange,
}) => {
    const handleChange = (e) => {
        if (e.target.value !== value) {
            onChange({ target: { name, value: e.target.value } });
        }
    };

    const handleClick = (e, index) => {
        if (index !== value) {
            onChange({ target: { name, value: index } });
        }
    };

    if (+value < min_value || +value > max_value) {
        onChange({
            target: {
                name,
                value: min_value,
            },
        });
    }

    return (
        <div className={classNames('range-slider', className, { 'range-slider__error': ((value < +min_value) || (value > +max_value)) })}>
            <label className='range-slider__label' htmlFor='range'>
                <input
                    id='range'
                    className='input trade-container__input range-slider__track'
                    type='range'
                    min={min_value}
                    max={max_value}
                    min_value={min_value}
                    max_value={max_value}
                    name={name}
                    steps={max_value - min_value}
                    onChange={handleChange}
                    tabIndex='0'
                    value={value}
                />
                <div className='range-slider__ticks'>
                    <TickSteps
                        value={value}
                        onClick={handleClick}
                    />
                </div>
                {/* Calculate line width based on active value and size of range thumb */}
                <div
                    className='range-slider__line'
                    style={{ width: `calc(${(value - min_value) * (100 / (max_value - min_value))}% ` }}
                />
            </label>
            <div className='range-slider__caption'>
                <span className='range-slider__caption--first'>
                    {min_value}
                </span>
                {
                    !!value &&
                    <span className='range-slider__caption-title'>
                        {+value === 1 && localize('{{value}} Tick', { value })}
                        {+value > 1 && localize('{{value}} Ticks', { value })}
                    </span>
                }
                <span className='range-slider__caption--last'>
                    {max_value}
                </span>
            </div>
        </div>
    );
};
// Keypress events do not trigger on Safari due to the way it handles input type='range' elements, using focus on the input element also doesn't work for Safari.

RangeSlider.propTypes = {
    className : PropTypes.string,
    first_tick: PropTypes.number,
    max_value : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    min_value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    name    : PropTypes.string,
    onChange: PropTypes.func,
    value   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default connect(
    ({ modules }) => ({
        max_value: modules.trade.duration_min_max.tick.max,
        min_value: modules.trade.duration_min_max.tick.min,
    })
)(observer(RangeSlider));
