import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconPlus = ({ className, is_disabled }) => (
    <svg className={classNames('inline-icon', className, { disabled: is_disabled })} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' fill='#7f8397' fillRule='evenodd' d='M8.5 7.5H13v1H8.5V13h-1V8.5H3v-1h4.5V3h1v4.5z' />
    </svg>

);

IconPlus.propTypes = {
    className  : PropTypes.string,
    is_disabled: PropTypes.bool,
};

export default IconPlus;
