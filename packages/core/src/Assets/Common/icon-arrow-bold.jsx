import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconArrowBold = ({ className, classNamePath }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16'>
        <path
            className={classNames(classNamePath, 'color1-fill')}
            fill='#000'
            fillOpacity='.8'
            fillRule='evenodd'
            d='M8 9.586l5.293-5.293a1 1 0 0 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 1.414-1.414L8 9.586z'
        />
    </svg>
);

IconArrowBold.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
};

export default IconArrowBold;
