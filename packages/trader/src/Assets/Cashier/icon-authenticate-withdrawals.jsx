import PropTypes from 'prop-types';
import React     from 'react';

const IconAuthenticateWithdrawals = ({ className }) => (
    <svg className={className} width='170' height='200' viewBox='0 0 170 200'>
        <defs>
            <polygon points='0.0005 0.2491 169.126 0.2491 169.126 200 0.0005 200' />
        </defs>
        <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
            <g transform='translate(-244.000000, -81.000000)'>
                <g>
                    <g transform='translate(244.000000, 80.000000)'>
                        <g transform='translate(0.000000, 0.751000)'>
                            <mask fill='white'>
                                <use xlinkHref='#path-1' />
                            </mask>
                            <g />
                            <path d='M84.5635,0.2491 C84.5635,0.2491 43.8105,25.6891 0.0005,32.2831 C0.0005,32.2831 16.4885,133.5731 23.0825,143.4631 C29.6815,153.3581 74.6685,200.0001 84.5635,200.0001 C94.4575,200.0001 139.4465,153.3581 146.0425,143.4631 C152.6355,133.5731 169.1265,32.2831 169.1265,32.2831 C125.3155,25.6891 84.5635,0.2491 84.5635,0.2491' id='Fill-1' fill='#C7E5E5' mask='url(#mask-2)' />
                        </g>
                        <path d='M95.762,87.167 C102.461,83.396 106.992,76.23 106.992,67.996 C106.992,55.848 97.145,46 84.997,46 C72.849,46 63,55.848 63,67.996 C63,76.23 67.533,83.396 74.232,87.167 L74.216,87.167 L63.301,131.785 L106.992,131.785 L95.782,87.167 L95.762,87.167 Z' id='Fill-4' fill='#84ABAF' />
                    </g>
                </g>
            </g>
        </g>
    </svg>
);

IconAuthenticateWithdrawals.propTypes = {
    className: PropTypes.string,
};

export default IconAuthenticateWithdrawals;
