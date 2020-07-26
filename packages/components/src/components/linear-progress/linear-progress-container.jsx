import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress } from './linear-progress.jsx';

class LinearProgressContainer extends React.Component {
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

        return (
            <div className='dc-linear-progress-container'>
                <div className='dc-linear-progress__countdown'>{this.props.render(this.remaining)}</div>
                <LinearProgress className={className} progress={this.progress} height={4} />
            </div>
        );
    }
}

LinearProgressContainer.propTypes = {
    timeout: PropTypes.number,
    action: PropTypes.func,
    render: PropTypes.func.isRequired,
};

export default LinearProgressContainer;
