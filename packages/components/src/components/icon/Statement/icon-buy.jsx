import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconBuy = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path d='M1.707 6.5H15.5a.5.5 0 1 1 0 1H.5a.5.5 0 0 1-.354-.854l3-3a.5.5 0 1 1 .708.708L1.707 6.5zm0 3l2.147 2.146a.5.5 0 1 1-.708.708l-3-3A.5.5 0 0 1 .5 8.5h15a.5.5 0 1 1 0 1H1.707z' fill='#F44336' />
    </svg>
);

IconBuy.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
    onClick      : PropTypes.func,
};

export default IconBuy;
