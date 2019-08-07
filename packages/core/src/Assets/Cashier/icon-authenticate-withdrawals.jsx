import PropTypes from 'prop-types';
import React     from 'react';

const IconAuthenticateWithdrawals = ({ className }) => (
    <svg className={className} width='200' height='200' viewBox='0 0 200 200'>
        <g fill='none' fillRule='evenodd'>
            <circle fill='#C7E5E5' cx='100' cy='100' r='100' />
            <circle fill='#FFF' cx='100' cy='100' r='88' />
            <path d='M100 167c-37.003 0-67-29.997-67-67s29.997-67 67-67 67 29.997 67 67-29.997 67-67 67zm0-5c34.242 0 62-27.758 62-62 0-34.242-27.758-62-62-62-34.242 0-62 27.758-62 62 0 34.242 27.758 62 62 62z' fill='#84ABAF' />
            <circle fill='#E2F1F1' cx='100' cy='100' r='27' />
            <path fill='#2B2B2B' d='M118.25 88.24l-7.14 7.54-7-7.61-39-.17-.11 23.92 17.71.08 7.13-7.52 7 7.59 39 .18.11-23.93z' />
        </g>
    </svg>
);

IconAuthenticateWithdrawals.propTypes = {
    className: PropTypes.string,
};

export default IconAuthenticateWithdrawals;
