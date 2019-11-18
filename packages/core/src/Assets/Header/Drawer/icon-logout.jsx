import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconLogout = ({ className }) => (
    <svg className={classNames('inline-icon', className)} viewBox='0 0 16 16' width='16' height='16'>
        <path
            className='color1-fill'
            fill='#333'
            fillRule='nonzero'
            d='M8.514 1.25c.916 0 1.612.978 1.612 2.132 0 .215-.168.39-.375.39a.383.383 0 0 1-.376-.39c0-.765-.417-1.351-.86-1.351H2.851c-.447 0-.861.58-.861 1.35v9.456c0 .764.417 1.35.861 1.35h5.662c.448 0 .861-.58.861-1.35 0-.216.169-.39.376-.39s.375.174.375.39c0 1.16-.693 2.132-1.612 2.132H2.852c-.916 0-1.612-.979-1.612-2.132V3.382c0-1.16.693-2.133 1.612-2.133zm3.217 3.519l.06.05 2.86 3.014c.125.13.143.331.053.482l-.054.07-2.86 3.015a.365.365 0 0 1-.53 0 .402.402 0 0 1-.055-.482l.054-.07 2.226-2.349h-8.66a.383.383 0 0 1-.375-.39c0-.189.13-.346.3-.382l.076-.008h8.66L11.258 5.37a.402.402 0 0 1-.054-.482l.054-.07a.365.365 0 0 1 .472-.05z'
        />
    </svg>
);

IconLogout.propTypes = {
    className: PropTypes.string,
};

export default IconLogout;
