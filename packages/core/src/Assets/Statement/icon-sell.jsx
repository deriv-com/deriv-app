import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconSell = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path d='M14.293 6.5l-2.147-2.146a.5.5 0 0 1 .708-.708l3 3a.5.5 0 0 1-.354.854H.5a.5.5 0 0 1 0-1h13.793zM.5 9.5a.5.5 0 0 1 0-1h15a.5.5 0 0 1 .354.854l-3 3a.5.5 0 0 1-.708-.708L14.293 9.5H.5z' fill='#4CAF50' />
    </svg>
);

IconSell.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
    onClick      : PropTypes.func,
};

export default IconSell;
