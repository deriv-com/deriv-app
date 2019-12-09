import PropTypes    from 'prop-types';
import React        from 'react';

export const IconStartTime = ({ className, classNamePath }) => (
    <svg className={className} xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
        <g fill='none' fillRule='evenodd'>
            <path
                className={classNamePath}
                fill='#FFF'
                d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 2C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-20a5.5 5.5 0 0 1 5.5 5.487c0 2.946-5.095 9.956-5.311 10.253l-.19.26-.188-.26C11.593 19.447 6.5 12.426 6.5 9.487A5.5 5.5 0 0 1 12 4zm0 7.363a2.496 2.496 0 0 0 2.494-2.491 2.492 2.492 0 0 0-2.496-2.488 2.492 2.492 0 0 0-2.494 2.49 2.492 2.492 0 0 0 2.495 2.49z'
            />
        </g>
    </svg>
);

IconStartTime.propTypes = {
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
};

export default IconStartTime;
