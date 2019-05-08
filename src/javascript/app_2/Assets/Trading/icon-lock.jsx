import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconLock = ({ className }) => (
    <svg className={classNames('inline-icon', className)} viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd' transform='translate(3 1)'>
            <rect className='color1-stroke' width='9' height='7' x='.5' y='6.5' stroke='none' rx='1' />
            <circle className='color1-fill' cx='5' cy='10' r='1' fill='none' />
            <path className='color1-stroke' stroke='none' d='M5 .5C7 .5 8.5 2.1 8.5 4v2.5h-7V4C1.5 2 3.1.5 5 .5z' />
        </g>
    </svg>
);

IconLock.propTypes = {
    className: PropTypes.string,
};

export { IconLock };
