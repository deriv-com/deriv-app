import PropTypes from 'prop-types';
import React     from 'react';

const IconTransferDone = ({ className }) => (
    <svg className={className} width='128' height='128' viewBox='0 0 128 128'>
        <g fill='none' fillRule='evenodd'>
            <path fill='#C7E5E5' fillRule='nonzero' d='M83.25 69.47V24.22a2.59 2.59 0 0 0-2.6-2.6H35.42a2.6 2.6 0 0 0-2.6 2.6v45.25a2.6 2.6 0 0 0 2.6 2.6h45.26a2.61 2.61 0 0 0 2.57-2.6z' />
            <path fill='#E0F4F3' fillRule='nonzero' d='M67.36 106.49h45.45a2.61 2.61 0 0 0 2.61-2.61V58.46a2.61 2.61 0 0 0-2.61-2.61H67.36a2.61 2.61 0 0 0-2.61 2.61v45.44a2.61 2.61 0 0 0 2.61 2.59z' />
            <ellipse cx='104.99' cy='105' fill='#84ABAE' fillRule='nonzero' rx='23.01' ry='23' />
            <path fill='#FFF' fillRule='nonzero' d='M103.38 112.38a1.09 1.09 0 0 1-.68-.24l-6.06-5a1.09 1.09 0 0 1-.15-1.51 1.07 1.07 0 0 1 1.51-.15l5.23 4.28 9.45-11.61a1.07 1.07 0 1 1 1.66 1.35L104.22 112a1.08 1.08 0 0 1-.73.39l-.11-.01z' />
            <path fill='#85ACB0' fillRule='nonzero' d='M93.7 34.57a12.08 12.08 0 0 1 12.08 12.08v6.71h5.37v-6.71c0-9.637-7.813-17.45-17.45-17.45v-4l-8 6.71 8 6.71v-4.05zM54.27 93c-6.664 0-12.069-5.396-12.08-12.06v-6.71h-5.37v6.71a17.45 17.45 0 0 0 17.45 17.45v4l8-6.72-8-6.71V93z' />
            <path d='M0 0h128v128H0z' />
        </g>
    </svg>
);

IconTransferDone.propTypes = {
    className: PropTypes.string,
};

export default IconTransferDone;
