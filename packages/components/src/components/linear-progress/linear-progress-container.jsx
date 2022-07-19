import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress } from './linear-progress.jsx';

const LinearProgressContainer = React.forwardRef(
    ({ timeout, action, render, className, should_store_in_session, session_id }, ref) => {
        const current_progress_timeout = sessionStorage.getItem(`linear_progress_timeout_${session_id}`);

        const popup_timeout = !current_progress_timeout ? timeout / 1000 : current_progress_timeout;
        const [timeout_state, setTimeoutState] = React.useState(popup_timeout);
        const time_past = 100 - (timeout_state / (timeout / 1000)) * 100;

        const getProgress = () => time_past;
        const getRemaining = () => (timeout_state > 0 ? timeout_state : 0);
        const makeProgress = () => {
            setTimeoutState(timeout_current => timeout_current - 1);
        };

        React.useImperativeHandle(ref, () => ({
            removeTimeoutSession() {
                if (should_store_in_session) {
                    sessionStorage.removeItem(`linear_progress_timeout_${session_id}`);
                }
            },
        }));

        React.useEffect(() => {
            if (should_store_in_session) {
                sessionStorage.setItem(`linear_progress_timeout_${session_id}`, timeout_state);
            }
        }, [timeout_state, should_store_in_session, session_id]);

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

        if (current_progress_timeout <= 0) {
            sessionStorage.removeItem(`linear_progress_timeout_${session_id}`);
        } else if (current_progress_timeout > 0) {
            sessionStorage.setItem(`linear_progress_timeout_${session_id}`, timeout_state);
        } else {
            return null;
        }

        if (!timeout) return null;

        return (
            <div className='dc-linear-progress-container'>
                <div className='dc-linear-progress__countdown'>{render(getRemaining())}</div>
                <LinearProgress className={className} progress={getProgress()} height={4} />
            </div>
        );
    }
);

LinearProgressContainer.propTypes = {
    timeout: PropTypes.number,
    action: PropTypes.func,
    render: PropTypes.func.isRequired,
};

LinearProgressContainer.displayName = 'LinearProgressContainer';

export default LinearProgressContainer;
