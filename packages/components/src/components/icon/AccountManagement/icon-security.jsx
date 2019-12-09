import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconSecurity = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <g className='color1-fill' fillRule='evenodd'>
            <path d='M7 6V5a1 1 0 1 1 2 0v1a.5.5 0 1 0 1 0V5a2 2 0 1 0-4 0v1a.5.5 0 1 0 1 0zM10 8v3H6V8h4zm0-1H6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z' />
            <circle cx='8' cy='9.001' r='1' />
            <rect width='1' height='1.08' x='7.75' y='9.181' rx='.25' />
            <path d='M8 0v1a7.79 7.79 0 0 0 5.23 2.16.71.71 0 0 1 .69.68v.51a16.19 16.19 0 0 1-.66 6A7.08 7.08 0 0 1 11.58 13a9.36 9.36 0 0 1-3.48 2h-.17a9.53 9.53 0 0 1-3.52-2 7 7 0 0 1-1.73-2.64A16.08 16.08 0 0 1 2 4.38v-.53a.71.71 0 0 1 .69-.68A7.79 7.79 0 0 0 8 1V0zm0 0a1.05 1.05 0 0 0-.71.27 6.79 6.79 0 0 1-4.61 1.9A1.71 1.71 0 0 0 1 3.83v.5a16.9 16.9 0 0 0 .72 6.33 8.1 8.1 0 0 0 2 3 10.51 10.51 0 0 0 3.89 2.24h.16L8 16h.38a10.61 10.61 0 0 0 3.88-2.24 8 8 0 0 0 2-3A16.93 16.93 0 0 0 15 4.34v-.5a1.71 1.71 0 0 0-1.64-1.66A6.79 6.79 0 0 1 8.73.28 1 1 0 0 0 8 0z' />
        </g>
    </svg>
);

IconSecurity.propTypes = {
    className: PropTypes.string,
};

export default IconSecurity;
