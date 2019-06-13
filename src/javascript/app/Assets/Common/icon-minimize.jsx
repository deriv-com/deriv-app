import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconMinimize = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' fill='#000' fillOpacity='0.8' fillRule='nonzero' d='M0 7h16v2H0z' />
    </svg>
);

IconMinimize.propTypes = {
    className: PropTypes.string,
};

export default IconMinimize;
