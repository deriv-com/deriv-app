import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconBell = ({ className }) => (
    <svg className={classNames('inline-icon', className)} viewBox='0 0 16 16'>
        <g className='color1-stroke' fill='none' fillRule='evenodd' stroke='#2A3052'>
            <path d='M12.8 11.6l-.3-.2V7a4.5 4.5 0 1 0-9 0v4.4l-.3.2a1 1 0 0 0 .3 1.9h9a1 1 0 0 0 .3-2z' />
            <path d='M7 2.5h2v-1a1 1 0 1 0-2 0v1zm-.5 11v.5a1.5 1.5 0 0 0 3 0v-.5h-3z' />
        </g>
    </svg>
);

IconBell.propTypes = {
    className: PropTypes.string,
};

export { IconBell };
