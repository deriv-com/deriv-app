import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconBack = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <path className='color1-stroke' stroke='#979797' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 1L1 8l7 7M1 8h14' />
            <path className='color1-fill' fill='#7F8397' fillRule='nonzero' d='M3.414 7H15a1 1 0 0 1 0 2H3.414l5.293 5.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 1 1 1.414 1.414L3.414 7z' />
        </g>
    </svg>
);

IconBack.propTypes = {
    className: PropTypes.string,
};

export default IconBack;
