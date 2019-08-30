import PropTypes from 'prop-types';
import React     from 'react';

// TODO remove this file entirely when icon component is ready.
const IconInfoBlue = ({ className }) => (
    <svg className={className} width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <circle cx='8' cy='8' r='8' fill='#2196F3' />
            <g fill='#FFF' transform='translate(6.5 4)'>
                <circle cx='1.5' cy='1' r='1' />
                <rect width='2' height='5' x='.5' y='3' rx='1' />
            </g>
        </g>
    </svg>
);

IconInfoBlue.propTypes = {
    className: PropTypes.string,
};

export default IconInfoBlue;
