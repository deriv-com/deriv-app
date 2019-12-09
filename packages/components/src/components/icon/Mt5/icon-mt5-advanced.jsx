import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconMt5Advanced = ({ className }) => (
    <svg
        className={classNames('inline-icon', className)}
        xmlns='http://www.w3.org/2000/svg'
        width='64'
        height='64'
        viewBox='0 0 64 64'
    >
        <g fill='none' fillRule='evenodd' transform='translate(8 4)'>
            <path
                fill='#85ACB0'
                fillRule='nonzero'
                d='M29.135 28.935a4.35 4.35 0 017.5.465l4.265 8.56 4.26 8.565c.075.15.14.3.2.45 1.33 3.62-3 6.755-6.195 4.615L34.5 48.45a5.5 5.5 0 00-5.535-.345m-12.1-19.17a4.35 4.35 0 00-7.5.465l-4.29 8.56-4.26 8.565a5.9 5.9 0 00-.2.45c-1.33 3.62 3 6.755 6.195 4.615l4.69-3.14a5.5 5.5 0 015.535-.345'
            />
            <path
                fill='#C7E5E5'
                fillRule='nonzero'
                d='M24.17 3.94V2.265a1.515 1.515 0 10-3.03 0V3.94C16.64 6.235 9.105 17.29 9.105 30.6c0 8.76 2.08 16.55 5.305 21.5l16.445.07c3.25-4.95 5.35-12.775 5.35-21.575 0-13.305-7.56-24.36-12.035-26.655z'
            />
            <ellipse
                cx='7'
                cy='7.46'
                fill='#85ACB0'
                fillRule='nonzero'
                opacity='.41'
                rx='6.9'
                ry='7.165'
                transform='translate(16 14.5)'
            />
            <path
                fill='#84ABAE'
                fillRule='nonzero'
                d='M23 17.3a3.87 3.87 0 11.01 7.74A3.87 3.87 0 0123 17.3zm0-2.5a6.37 6.37 0 106.365 6.365A6.365 6.365 0 0023 14.8z'
            />
            <path
                fill='#BCCDCE'
                fillRule='nonzero'
                d='M21.39 58.135l-3.245-7.455a2.14 2.14 0 01.255-2.135l3.245-4.17a1.675 1.675 0 012.71 0l3.245 4.17c.462.614.56 1.43.255 2.135l-3.245 7.455a1.72 1.72 0 01-3.22 0z'
            />
            <path
                fill='#85ACB0'
                fillRule='nonzero'
                d='M21.645 44.375l-3.245 4.17a2.14 2.14 0 00-.255 2.135l3.245 7.455c.26.664.897 1.105 1.61 1.115V43.685a1.705 1.705 0 00-1.355.69z'
                opacity='.45'
            />
            <path d='M-9-2h64v64H-9z' />
        </g>
    </svg>

);

IconMt5Advanced.propTypes = {
    className: PropTypes.string,
};

export default IconMt5Advanced;
