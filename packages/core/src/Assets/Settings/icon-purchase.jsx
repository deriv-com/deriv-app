import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconPurchase = ({ className }) => (
    <svg
        className={classNames('inline-icon', className)}
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
    >
        <g fill='none' fillRule='evenodd'>
            <path
                className='color1-fill'
                fill='#000'
                fillOpacity='0.8'
                d='M9 9l-1-.001V11H7V9H5.503V5.501a.501.501 0 1 0-1.003 0V10l.003 1.89L6 14.36V15h4v-.651l1-1.5V10.5a1.5 1.5 0 0 0-1-1.415V11H9V9zM3.5 5.5a1.501 1.501 0 0 1 3.003 0V8H9.5a2.5 2.5 0 0 1 2.5 2.5v2.651l-1 1.5V16H5v-1.36l-1.497-2.471V11L3.5 5.501zM1 6h2v1H0V0h16v7H7V6h8V1H1v5z'
            />
        </g>
    </svg>
);

IconPurchase.propTypes = {
    className: PropTypes.string,
};

export default IconPurchase;
