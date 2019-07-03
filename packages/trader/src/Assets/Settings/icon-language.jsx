import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconLanguage = ({ className }) => (
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
                d='M8 15.794l-2.75-3.407H0V0h16v12.387h-5.25L8 15.794zm-7-4.44h4.75L8 14.143l2.25-2.787H15V1.032H1v10.323zM11 9.29H3V8.258h8V9.29zm2-2.58H3V5.677h10V6.71zm0-2.581H3V3.097h10v1.032z'
            />
        </g>
    </svg>
);

IconLanguage.propTypes = {
    className: PropTypes.string,
};

export default IconLanguage;
