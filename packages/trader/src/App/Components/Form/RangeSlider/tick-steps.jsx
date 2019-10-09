import classNames               from 'classnames';
import PropTypes                from 'prop-types';
import React, { PureComponent } from 'react';

class TickSteps extends PureComponent {
    state = {
        arr_ticks: [],
    }

    componentDidMount() {
        const { min_value, max_value } = this.props;
        const max_tick = 10;

        if (max_value <= max_tick) {
            this.setState({
                arr_ticks: Array.from(Array((max_value - min_value) + 1).keys()),
            });
        }
    }

    isActive(idx) {
        const { min_value, value } = this.props;
        return (idx + min_value) === value;
    }

    isMarked(idx) {
        const { min_value, value } = this.props;
        return (idx + min_value) < value;
    }

    isMarkedOnHover(idx) {
        const { min_value, hover_value } = this.props;
        return (this.isMarked(idx)) ? false : (idx + min_value) <= hover_value;
    }

    render() {
        const { min_value, onMouseEnter, onMouseLeave, onClick } = this.props;
        const { arr_ticks } = this.state;

        return (
            <React.Fragment>
                {arr_ticks.map(idx =>
                    <span
                        key={idx}
                        className={classNames('range-slider__ticks-step', {
                            'range-slider__ticks-step--active'      : this.isActive(idx),
                            'range-slider__ticks-step--marked'      : this.isMarked(idx),
                            'range-slider__ticks-step--marked-hover': this.isMarkedOnHover(idx),
                        })}
                        onClick={() => onClick(idx + min_value)}
                        onMouseEnter={() => onMouseEnter(idx + min_value)}
                        onMouseLeave={onMouseLeave}
                    />
                )}
            </React.Fragment>
        );
    }
}

TickSteps.propTypes = {
    hover_value : PropTypes.number,
    max_value   : PropTypes.number,
    min_value   : PropTypes.number,
    onClick     : PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    value       : PropTypes.number,
};

export default TickSteps;
