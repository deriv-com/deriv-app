import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Localize } from '@deriv/translations';

const LinearProgress = ({ progress }) => (
    <div className={classNames('dc-linear-progress')}>
        <div className={classNames('dc-linear-progress__bar')} style={{ width: `${progress}%` }} />
    </div>
);

class TimeoutBorderBottom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeout: props.timeout / 1000,
            total_ticks: Math.round(props.timeout / 1000),
            current_tick: Math.round(props.timeout / 1000),
        };
    }

    get progress() {
        return 100 - Math.round((this.state.current_tick / this.state.total_ticks) * 100);
    }

    get remaining() {
        return this.state.timeout >= 0 ? this.state.timeout : 0;
    }

    makeProgress = () => {
        this.setState({
            current_tick: this.state.current_tick - 1,
            timeout: this.state.timeout - 1,
        });
    };

    run = () => {
        this.props.action();
    };

    componentDidMount() {
        this.interval = setInterval(this.makeProgress, 1000);
    }

    componentDidUpdate() {
        if (this.progress > 100) {
            this.run();
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { timeout, className } = this.props;
        if (!timeout) return null;
        // return null;
        return (
            <div className='notification__timeout-container'>
                <div className='notification__timeout-countdown'>
                    <Localize
                        i18n_default_text='Auto update in {{ remaining }} seconds'
                        values={{
                            remaining: this.remaining,
                        }}
                    />
                </div>
                <LinearProgress className={className} progress={this.progress} height={4} />
            </div>
        );
    }
}

TimeoutBorderBottom.propTypes = {
    timeout: PropTypes.number,
    action: PropTypes.func,
};

export default TimeoutBorderBottom;
