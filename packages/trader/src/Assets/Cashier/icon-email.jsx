import PropTypes from 'prop-types';
import React     from 'react';

const IconPhone = ({ className }) => (
    <svg className={className} width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <path fill='#333' fillRule='nonzero' d='M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 1v.22L8 6.91 2 3.22V3h12zM2 13V4.39l5.74 3.54a.52.52 0 0 0 .52 0L14 4.39V13H2z' />
            <path d='M0 0h16v16H0z' />
        </g>
    </svg>

);

IconPhone.propTypes = {
    className: PropTypes.string,
};

export default IconPhone;
