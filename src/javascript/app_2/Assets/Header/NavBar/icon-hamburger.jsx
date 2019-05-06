import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconHamburger = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='24' height='24' viewBox='0 0 24 24'>
        <path className='color1-fill' d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' fill='#000' fillRule='evenodd' />
    </svg>
);

IconHamburger.propTypes = {
    className: PropTypes.string,
};

export { IconHamburger };
