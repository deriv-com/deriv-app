import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconUser = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='24' height='24' viewBox='0 0 24 24'>
        <g fill="none" fillRule="evenodd">
            <path d="M2 2h20v20H2z"/>
            <path fill="#333" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-1a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"/>
            <path fill="#333" d="M12 12a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5zm0-1a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5zM8 18v-1.932c.006-1.129 1.025-2.063 2.305-2.068h3.392c1.278.005 2.297.94 2.303 2.07V18a.5.5 0 1 0 1 0v-1.932c-.008-1.703-1.49-3.06-3.3-3.068h-3.397C8.49 13.008 7.008 14.365 7 16.066V18a.5.5 0 1 0 1 0z"/>
        </g>
    </svg>
);

IconUser.propTypes = {
    className: PropTypes.string,
};

export default IconUser;
