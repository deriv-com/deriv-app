import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

// TODO remove this file entirely when icon component is ready.
const IconArrow = ({ className, classNamePath }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16'>
        <path
            className={classNames(classNamePath, 'color1-fill')}
            fill='rgba(0, 0, 0, 0.8)'
            fillRule='nonzero'
            d='M13.164 5.13a.5.5 0 1 1 .672.74l-5.5 5a.5.5 0 0 1-.672 0l-5.5-5a.5.5 0 0 1 .672-.74L8 9.824l5.164-4.694z'
        />
    </svg>
);

IconArrow.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
};

export default IconArrow;
