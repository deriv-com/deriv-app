import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconPortfolio = ({ className }) => (
    <svg className={classNames('inline-icon', className)} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <path fill='rgba(0, 0, 0, 0.8)' fillRule='evenodd' d='M5 3v-.5A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V3h3.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9A1.5 1.5 0 0 1 1.5 3H5zm1 0h4v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V3zM1 9.128V13.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V9.128l-2.804 1.557a2.5 2.5 0 0 1-1.214.315H5.018a2.5 2.5 0 0 1-1.214-.315L1 9.128zm0-1.144L4.29 9.81a1.5 1.5 0 0 0 .728.189h5.964a1.5 1.5 0 0 0 .728-.189L15 7.984V4.5a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5v3.484zM6.5 9a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3z' />
    </svg>
);

IconPortfolio.propTypes = {
    className: PropTypes.string,
};

export default IconPortfolio;
