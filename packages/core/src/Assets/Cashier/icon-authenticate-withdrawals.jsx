import PropTypes from 'prop-types';
import React     from 'react';

const IconAuthenticateWithdrawals = ({ className }) => (
    <svg className={className} width='128' height='128' viewBox='0 0 128 128'>
        <circle fill='#c6e4e4' cx='64' cy='64' r='59' />
        <circle fill='#fff' cx='64' cy='64' r='52' />
        <circle fill='#e0f0f0' cx='64' cy='64' r='15' />
        <path fill='#2a2a2a' fillRule='evenodd' d='M73.89,57.56l-3.61,3.86-3.56-3.89a2,2,0,0,0-1.47-.65l-20.12-.09a2,2,0,0,0-2,2l0,10.19a2,2,0,0,0,2,2l7.57,0a2,2,0,0,0,1.47-.63l3.61-3.85,3.56,3.88a2,2,0,0,0,1.46.65l20.13.09a2,2,0,0,0,2-2l0-10.19a2,2,0,0,0-2-2l-7.57,0A2,2,0,0,0,73.89,57.56Z' />
        <path fill='#83a9ae' d='M64.25,103.49A39.47,39.47,0,1,1,77.36,27h0A39.67,39.67,0,0,1,99.72,47.44a39.22,39.22,0,0,1-35.47,56.05Zm-.52-75.73a36,36,0,0,0-33.88,23.7A36.55,36.55,0,0,0,51.72,98,36,36,0,0,0,96.81,48.83,36.46,36.46,0,0,0,76.26,30h0A36.28,36.28,0,0,0,63.73,27.76Z' />
        <rect fill='none' width='128' height='128' />
        <rect fill='none' width='128' height='128' />
    </svg>
);

IconAuthenticateWithdrawals.propTypes = {
    className: PropTypes.string,
};

export default IconAuthenticateWithdrawals;
