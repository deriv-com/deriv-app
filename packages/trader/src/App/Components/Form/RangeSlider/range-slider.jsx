import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'deriv-translations';
import TickSteps    from './tick-steps.jsx';

class RangeSlider extends React.PureComponent {
    state = {
        hover_value: 0,
    }

    handleChange = (e) => {
        // e.target.value returns string, we need to convert them to number
        const value = +e.target.value;
        if (value !== this.props.value) {
            this.resetOnHover();
            this.props.onChange({ target: { name: this.props.name, value } });
        }
    };

    handleClick = (index) => {
        if (index !== this.props.value) {
            this.resetOnHover();
            this.props.onChange({ target: { name: this.props.name, value: index } });
        }
    };

    onMouseEnter = (index) => {
        if (index) {
            this.setState({ hover_value: index });
            this.rangeSliderTrack.style.width = this.getRangeSliderTrackWidth(index, true);
        }
    };

    onMouseLeave = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        if (offsetY <= -3 || offsetY >= 3 || offsetX < -3 || offsetX > 3) {
            this.resetOnHover();
        }
    };

    getRangeSliderTrackWidth = (value, is_hover) => {
        const width = (value - this.props.min_value) * (10 / (this.props.max_value - this.props.min_value));
        return `${(width * 2) + (is_hover ? 0.8 : 1.4)}em`;
    };

    resetOnHover = () => {
        if (this.state.hover_value) {
            this.setState({ hover_value: 0 });
            this.rangeSliderTrack.style.width = 0;
        }
    };

    render() {
        const {
            className,
            max_value,
            min_value,
            name,
            value,
        } = this.props;

        const display_value = this.state.hover_value || value;
        return (
            <div className={classNames('range-slider', className, { 'range-slider__error': ((value < min_value) || (value > max_value)) })}>
                <label className='range-slider__label' htmlFor='range'>
                    <input
                        className='input trade-container__input range-slider__track'
                        id='dt_duration_range_input'
                        max={max_value}
                        max_value={max_value}
                        min={min_value}
                        min_value={min_value}
                        name={name}
                        onChange={this.handleChange}
                        tabIndex='0'
                        type='range'
                        steps={max_value - min_value}
                        value={value}
                    />
                    {/* this element to be placed before <TickSteps /> to prevent overlapping colors */}
                    <span
                        ref={node => this.rangeSliderTrack = node}
                        className='range-slider__line range-slider__line--fill'
                        onMouseLeave={this.onMouseLeave}
                    />
                    <div className='range-slider__ticks'>
                        <TickSteps
                            hover_value={this.state.hover_value}
                            max_value={max_value}
                            min_value={min_value}
                            onClick={this.handleClick}
                            onMouseLeave={this.onMouseLeave}
                            onMouseEnter={this.onMouseEnter}
                            value={value}
                        />
                    </div>
                    {/* Calculate line width based on active value and size of range thumb */}
                    <div
                        className='range-slider__line'
                        style={{ width: `${this.getRangeSliderTrackWidth(value)}` }}
                    />
                </label>
                <div className='range-slider__caption'>
                    {
                        !!display_value &&
                        <span id='dt_range_slider_label' className='range-slider__caption-title'>
                            {display_value === 1 && localize('{{display_value}} Tick', { display_value })}
                            {display_value > 1 && localize('{{display_value}} Ticks', { display_value })}
                        </span>
                    }
                </div>
            </div>
        );
    }
}
// Keypress events do not trigger on Safari due to the way it handles input type='range' elements, using focus on the input element also doesn't work for Safari.

RangeSlider.propTypes = {
    className: PropTypes.string,
    max_value: PropTypes.number,
    min_value: PropTypes.number,
    name     : PropTypes.string,
    onChange : PropTypes.func,
    value    : PropTypes.number,
};

export default RangeSlider;
