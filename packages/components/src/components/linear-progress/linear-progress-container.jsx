import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress } from './linear-progress.jsx';

const LinearProgressContainer = ({ timeout, action, render, className }) => {
    const [timeout_state, setTimeout] = React.useState(timeout / 1000);
    const [current_tick, setCurrentTick] = React.useState(Math.round(timeout / 1000));
    const total_ticks = React.useState(Math.round(timeout / 1000));

    const getProgress = () => 100 - Math.round((current_tick / total_ticks) * 100);

    const getRemaining = () => (timeout >= 0 ? timeout : 0);

    const makeProgress = () => {
        setCurrentTick(current_tick - 1);
        setTimeout(timeout_state - 1);
    };

    React.useEffect(() => {
        const interval = setInterval(makeProgress, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    React.useEffect(() => {
        if (getProgress() > 100) {
            action();
        }
    });

    if (!timeout) return null;

    return (
        <div className='dc-linear-progress-container'>
            <div className='dc-linear-progress__countdown'>{render(getRemaining())}</div>
            <LinearProgress className={className} progress={getProgress()} height={4} />
        </div>
    );
};

LinearProgressContainer.propTypes = {
    timeout: PropTypes.number,
    action: PropTypes.func,
    render: PropTypes.func.isRequired,
};

export default LinearProgressContainer;
