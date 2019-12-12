import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconP2PCashier = ({ className }) => (
    <svg className={classNames('inline-icon', className)} id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'>
        <path className='color1-fill' d='M.5,16a.46.46,0,0,1-.33-.13.48.48,0,0,1,0-.7L2.2,12.86a.49.49,0,0,1,.36-.17.51.51,0,0,1,.37.15l.46.46a3.84,3.84,0,0,0,2.86,1.09,4.36,4.36,0,0,0,2.9-1.24,3.6,3.6,0,0,0,0-5.3l-2-2a.49.49,0,0,1,.7-.7l2,2a4.57,4.57,0,0,1,0,6.7,5.28,5.28,0,0,1-3.57,1.54A4.77,4.77,0,0,1,2.68,14l-.08-.08L.87,15.83A.5.5,0,0,1,.5,16Z'/>
        <path className='color1-fill' d='M7.5,12a.47.47,0,0,1-.35-.15l-2-2A5.56,5.56,0,0,1,3.48,6.47,4.28,4.28,0,0,1,4.74,3,4.69,4.69,0,0,1,8.32,1.61a5.14,5.14,0,0,1,3.21,1.24L15.2.1a.5.5,0,0,1,.6.8l-4,3a.49.49,0,0,1-.65,0A4.21,4.21,0,0,0,8.28,2.61,3.86,3.86,0,0,0,5.45,3.7a3.28,3.28,0,0,0-1,2.68A4.6,4.6,0,0,0,5.85,9.15l2,2a.48.48,0,0,1,0,.7A.47.47,0,0,1,7.5,12Z'/>
        <rect width='16' height='16' style={{ fill: 'none' }} />
    </svg>
);

IconP2PCashier.propTypes = {
    className: PropTypes.string,
};

export default IconP2PCashier;
