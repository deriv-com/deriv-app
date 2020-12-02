import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress } from './linear-progress.jsx';

const LinearProgressContainer = ({ timeout, action, render, ...other_props }) => {
    const [timeout_state, setTimeout] = React.useState(timeout);
    const [current_tick, setCurrentTick] = React.useState(Math.round(timeout / 1000));
    const total_ticks = React.useState(Math.round(timeout / 1000));

    const progress = () => {
        return 100 - Math.round((current_tick / total_ticks) * 100);
    };

    const remaining = () => {
        return timeout >= 0 ? timeout : 0;
    };

    const makeProgress = () => {
        setCurrentTick(current_tick - 1);
        setTimeout(timeout_state - 1);
    };

    const run = () => {
        action();
    };

    React.useEffect(() => {
        const interval = setInterval(makeProgress, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    React.useEffect(() => {
        if (progress > 100) {
            run();
        }
    });

    const { className } = other_props;
    if (!timeout) return null;

    return (
        <div className='dc-linear-progress-container'>
            <div className='dc-linear-progress__countdown'>{render(remaining())}</div>
            <LinearProgress className={className} progress={progress()} height={4} />
        </div>
    );
};

LinearProgressContainer.propTypes = {
    timeout: PropTypes.number,
    action: PropTypes.func,
    render: PropTypes.func.isRequired,
};

export default LinearProgressContainer;
