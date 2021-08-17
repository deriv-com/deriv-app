import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress } from './linear-progress.jsx';

const LinearProgressContainer = ({ timeout, action, render, className }) => {
    const get_popup_timer = sessionStorage.getItem('popup_timer');
    if (!get_popup_timer) sessionStorage.setItem('popup_timer', timeout / 1000);
    const popup_timeout = !get_popup_timer ? timeout / 1000 : get_popup_timer;

    const [timeout_state, setTimeout] = React.useState(popup_timeout);
    const time_past = 100 - timeout_state / 3;

    const getProgress = () => time_past;

    const getRemaining = () => (timeout_state > 0 ? timeout_state : 0);

    const makeProgress = () => {
        setTimeout(timeout_current => timeout_current - 1);
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

    if (sessionStorage.getItem('popup_timer') <= 0) {
        sessionStorage.removeItem('popup_timer');
    } else {
        sessionStorage.setItem('popup_timer', timeout_state);
    }

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
