import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconMinus = ({ className, is_disabled }) => (
    <svg className={classNames('inline-icon', className, { disabled: is_disabled })} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' fill='#7f8397' fillRule='evenodd' d='M3 7.5h10v1H3z' />
    </svg>
);

IconMinus.propTypes = {
    className  : PropTypes.string,
    is_disabled: PropTypes.bool,
};

export default IconMinus;
