import classNames from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';

const IconClose = ({ className, classNamePath }) => (
    <svg className={classNames('inline-icon', className)} width='32' height='32' viewBox='0 0 32 32'>
        <path className={classNamePath || 'color1-fill'} fill='rgba(0, 0, 0, 0.8)' fillRule='evenodd' d='M9.753 8L5.166 3.872a.5.5 0 0 1 .668-.744l5 4.5a.5.5 0 0 1 0 .744l-5 4.5a.5.5 0 1 1-.668-.744L9.753 8z' />
        <path className={classNamePath || 'color1-fill'}  fill='#7F8397' fillRule='nonzero' d='M16 14.586l-4.293-4.293a1 1 0 0 0-1.414 1.414L14.586 16l-4.293 4.293a1 1 0 0 0 1.414 1.414L16 17.414l4.293 4.293a1 1 0 0 0 1.414-1.414L17.414 16l4.293-4.293a1 1 0 0 0-1.414-1.414L16 14.586zM16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16z' />
    </svg>

);

IconClose.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
};

export default IconClose;
