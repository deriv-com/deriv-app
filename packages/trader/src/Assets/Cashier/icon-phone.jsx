import PropTypes from 'prop-types';
import React     from 'react';

const IconPhone = ({ className }) => (
    <svg className={className} width='30' height='30' viewBox='0 0 30 30'>
        <defs>
            <filter id='a' width='104.4%' height='106.5%' x='-2.2%' y='-3.2%' filterUnits='objectBoundingBox'>
                <feOffset dy='2' in='SourceAlpha' result='shadowOffsetOuter1' />
                <feGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='4' />
                <feColorMatrix in='shadowBlurOuter1' result='shadowMatrixOuter1' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0' />
                <feMerge>
                    <feMergeNode in='shadowMatrixOuter1' />
                    <feMergeNode in='SourceGraphic' />
                </feMerge>
            </filter>
        </defs>
        <g fill='none' fillRule='evenodd' filter='url(#a)' transform='translate(-273 -387)'>
            <path fill='#999' fillRule='nonzero' d='M284.53 393v1a.4.4 0 0 1 .4.34c.102.748.286 1.483.55 2.19a.42.42 0 0 1-.08.47l-.9.89a1 1 0 0 0-.16 1.2 12.21 12.21 0 0 0 4.6 4.59 1 1 0 0 0 1.2-.16l.89-.89a.43.43 0 0 1 .29-.12h.14a10.49 10.49 0 0 0 2.19.55.41.41 0 0 1 .35.43v2.11a.41.41 0 0 1-.43.41 13 13 0 0 1-5.64-2 12.72 12.72 0 0 1-3.93-3.93 12.9 12.9 0 0 1-2-5.64.41.41 0 0 1 .41-.44h2.12v-1zm0 0h-2.25a1.4 1.4 0 0 0-1.28 1.53 13.86 13.86 0 0 0 2.17 6.09 13.7 13.7 0 0 0 4.22 4.22 13.93 13.93 0 0 0 6.08 2.16h.13a1.41 1.41 0 0 0 1.4-1.41v-2.11a1.4 1.4 0 0 0-1.21-1.42 9 9 0 0 1-2-.5 1.39 1.39 0 0 0-1.48.32l-.9.89a11.22 11.22 0 0 1-4.2-4.21l.89-.9a1.4 1.4 0 0 0 .32-1.48 8.88 8.88 0 0 1-.49-2 1.41 1.41 0 0 0-1.4-1.18z' />
            <path d='M280 392h16v16h-16z' />
        </g>
    </svg>
);

IconPhone.propTypes = {
    className: PropTypes.string,
};

export default IconPhone;
