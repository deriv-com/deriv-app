import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconVerification = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <path d='M0 .001h16v16H0z' />
            <path className='color1-fill' fill='#333' d='M8 0v1a7.79 7.79 0 0 0 5.23 2.16.71.71 0 0 1 .69.68v.51a16.19 16.19 0 0 1-.66 6A7.08 7.08 0 0 1 11.58 13a9.36 9.36 0 0 1-3.48 2h-.17a9.53 9.53 0 0 1-3.52-2 7 7 0 0 1-1.73-2.64A16.08 16.08 0 0 1 2 4.38v-.53a.71.71 0 0 1 .69-.68A7.79 7.79 0 0 0 8 1V0zm0 0a1.05 1.05 0 0 0-.71.27 6.79 6.79 0 0 1-4.61 1.9A1.71 1.71 0 0 0 1 3.83v.5a16.9 16.9 0 0 0 .72 6.33 8.1 8.1 0 0 0 2 3 10.51 10.51 0 0 0 3.89 2.24h.16L8 16h.38a10.61 10.61 0 0 0 3.88-2.24 8 8 0 0 0 2-3A16.93 16.93 0 0 0 15 4.34v-.5a1.71 1.71 0 0 0-1.64-1.66A6.79 6.79 0 0 1 8.73.28 1 1 0 0 0 8 0z' />
            <path className='color1-fill' fill='#333' d='M5.854 7.857a.5.5 0 0 0-.708.707l2 2a.5.5 0 0 0 .754-.053l3-4a.5.5 0 0 0-.8-.6L7.446 9.449 5.854 7.857z' />
        </g>
    </svg>
);

IconVerification.propTypes = {
    className: PropTypes.string,
};

export default IconVerification;
