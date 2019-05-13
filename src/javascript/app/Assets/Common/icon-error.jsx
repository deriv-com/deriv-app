import React from 'react';

const IconError = (/* { type } */) => ( // TODO: add icon for different types of error
    <svg width='64' height='64' viewBox='0 0 64 64'>
        <g fill='none' fillRule='evenodd'>
            <circle cx='32' cy='32' r='32' fill='#FFC107' />
            <g fill='#FFF' transform='matrix(1 0 0 -1 26 48)'>
                <circle cx='6' cy='4' r='4' />
                <path d='M6 12a4 4 0 0 1 4 4v12a4 4 0 1 1-8 0V16a4 4 0 0 1 4-4z' />
            </g>
        </g>
    </svg>
);

export { IconError };
