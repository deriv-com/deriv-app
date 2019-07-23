import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'App/i18n';
import { connect }  from 'Stores/connect';
import TickSteps    from './tick-steps.jsx';

class RangeSlider extends React.PureComponent {
    state = {
        hover_value: 0,
    }

    handleChange = (e) => {
        if (e.target.value !== this.props.value) {
            this.resetOnHover();
            this.props.onChange({ target: { name: this.props.name, value: e.target.value } });
        }
    };

    handleClick = (e, index) => {
        if (index !== this.props.value) {
            this.resetOnHover();
            this.props.onChange({ target: { name: this.props.name, value: index } });
        }
    };

    onMouseEnter = (e, index) => {
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
            onChange,
        } = this.props;

        if (+value < min_value || +value > max_value) {
            onChange({
                target: {
                    name,
                    value: min_value,
                },
            });
        }

        const display_value = this.state.hover_value || value;
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
                        onChange={this.handleChange}
                        tabIndex='0'
                        value={value}
                    />
                    {/* this element to be placed before <TickSteps /> to prevent overlapping colors */}
                    <span
                        ref={node => this.rangeSliderTrack = node}
                        className='range-slider__line range-slider__line--hover'
                        onMouseLeave={this.onMouseLeave}
                    />
                    <div className='range-slider__ticks'>
                        <TickSteps
                            value={value}
                            onClick={this.handleClick}
                            onMouseLeave={this.onMouseLeave}
                            onMouseEnter={this.onMouseEnter}
                            hover_value={this.state.hover_value}
                        />
                    </div>
                    {/* Calculate line width based on active value and size of range thumb */}
                    <div
                        className='range-slider__line'
                        style={{ width: `${this.getRangeSliderTrackWidth(value)}` }}
                    />
                </label>
                <div className='range-slider__caption'>
                    <span className='range-slider__caption--first'>
                        {min_value}
                    </span>
                    {
                        !!display_value &&
                        <span className='range-slider__caption-title'>
                            {+display_value === 1 && localize('{{display_value}} Tick', { display_value })}
                            {+display_value > 1 && localize('{{display_value}} Ticks', { display_value })}
                        </span>
                    }
                    <span className='range-slider__caption--last'>
                        {max_value}
                    </span>
                </div>
            </div>
        );
    }
}
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
