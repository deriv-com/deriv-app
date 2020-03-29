import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CircularProgress } from '@deriv/components';

class TimeoutCircularProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeout: props.timeout,
            total_ticks: Math.round(props.timeout / 1000),
            current_tick: Math.round(props.timeout / 1000),
        };
    }

    get progress() {
        return Math.round((this.state.current_tick / this.state.total_ticks) * 100);
    }

    makeProgress = () => {
        this.setState({
            current_tick: this.state.current_tick - 1,
        });
    };

    run = () => {
        this.props.action();
    };

    componentDidMount() {
        this.interval = setInterval(this.makeProgress, 1000);
    }

    componentDidUpdate() {
        if (this.progress === 0) {
            this.run();
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { timeout, className } = this.props;
        if (!timeout) return null;

        return <CircularProgress className={className} progress={this.progress} radius={24} />;
    }
}

TimeoutCircularProgress.propTypes = {
    timeout: PropTypes.number,
    action: PropTypes.func,
};

export default TimeoutCircularProgress;
