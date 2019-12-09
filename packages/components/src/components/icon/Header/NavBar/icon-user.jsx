import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconUser = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <path d='M0 0h16v16H0z' />
            <path className='color1-fill' fillOpacity='.8' d='M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0-1a8 8 0 1 0 0 16A8 8 0 0 0 8 0z' />
            <path className='color1-fill' fillOpacity='.8' d='M8 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0-1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM5 12.82v-1.64A1.69 1.69 0 0 1 6.682 9.5H9.32A1.69 1.69 0 0 1 11 11.182v1.638a.5.5 0 1 0 1 0v-1.64A2.69 2.69 0 0 0 9.322 8.5H6.68A2.69 2.69 0 0 0 4 11.178v1.642a.5.5 0 1 0 1 0z' />
        </g>
    </svg>
);

IconUser.propTypes = {
    className: PropTypes.string,
};

export default IconUser;
