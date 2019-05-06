import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const Icon404 = ({ className }) => (
    <svg className={classNames('inline-icon', className)} viewBox='0 0 163.61 82.15' height='64'>
        <defs />
        <g id='Layer_2' data-name='Layer 2'>
            <g id='Layer_1-2' data-name='Layer 1'>
                <g id='Layer_1-2-2' data-name='Layer 1-2'>
                    <path className='color1-stroke' fill='none' stroke='#2a3051' strokeMiterlimit='10' d='M116.85 4.22L51.71 81.04' />
                    <path className='color1-fill' d='M74.05 51.64a56 56 0 0 1-.58-8.48V28.71q.11-10.84 3.27-16.06t10.11-5.23q7 0 10.21 5.25a22.91 22.91 0 0 1 2.71 8.64l7-8.23a22.71 22.71 0 0 0-3-5.73Q98.33 0 86.85 0t-17 7.62q-5.43 7.62-5.42 23.29V43q.13 10.13 2.67 16.85zM97.19 30.52a59.46 59.46 0 0 1 .49 8V53.3q-.15 11.13-3.39 16.31t-9.94 5.17a11.07 11.07 0 0 1-10.13-5.49 23.35 23.35 0 0 1-2.75-8.44l-6.85 8.08-.15-.13a24.07 24.07 0 0 0 3 5.81q5.53 7.55 16.88 7.54t16.94-7.71q5.43-7.71 5.42-23.58V39.14q-.09-10.2-2.53-16.86zM41.46 53.28h9.86v7.37h-9.86v16.5h-9.09v-16.5H0v-5.32L31.84 6.06h9.62zm-31.21 0h22.12V18.41l-1.07 2zM153.75 54h9.86v7.37h-9.86v16.5h-9.08V61.38h-32.38v-5.32l31.84-49.27h9.62zm-31.2 0h22.12V19.14l-1.08 2z' />
                </g>
            </g>
        </g>
    </svg>

);

Icon404.propTypes = {
    className: PropTypes.string,
};

export { Icon404 };
