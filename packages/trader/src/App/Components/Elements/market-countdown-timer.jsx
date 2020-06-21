import React from 'react';
import PropTypes from 'prop-types';
import { Localize } from '@deriv/translations';

const calculateTimeLeft = target_date => {
    const difference = +new Date(target_date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return timeLeft;
};

const padWithZero = number => {
    if (number < 10) {
        return `0${number}`;
    }
    return number;
};

const MarketCountdownTimer = ({ target_date }) => {
    const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft(target_date));

    React.useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft(target_date));
        }, 1000);
    });

    let timer_components = '';

    Object.keys(timeLeft).forEach(interval => {
        if (interval === 'days') {
            if (timeLeft[interval]) {
                timer_components += `${timeLeft[interval]} ${interval} `;
            }
        } else {
            const value = timeLeft[interval];
            timer_components += interval !== 'seconds' ? `${padWithZero(value)}:` : `${padWithZero(value)}`;
        }
    });

    return (
        <React.Fragment>
            <p>
                <Localize i18n_default_text='Reopens:' />
            </p>
            <p className='market-is-closed-overlay__timer'>{timer_components} GMT</p>
        </React.Fragment>
    );
};

MarketCountdownTimer.propTypes = {
    target_date: PropTypes.string.isRequired,
};

export default MarketCountdownTimer;
