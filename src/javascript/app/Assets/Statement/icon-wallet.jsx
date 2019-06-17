import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconWallet = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <path className='color1-fill' d='M15 11V8h-3.5a1.5 1.5 0 0 0 0 3H15zm0-4V5H2a1.99 1.99 0 0 1-1-.268V13.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V12h-3.5a2.5 2.5 0 1 1 0-5H15zm0-3h1v9.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5V3a2 2 0 0 1 2-2h13v3zm-1 0V2H2a1 1 0 1 0 0 2h12zm-2.5 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z' fill='#2A3052' />
    </svg>
);

IconWallet.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
    onClick      : PropTypes.func,
};

export default IconWallet;
