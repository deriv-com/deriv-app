import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconFlag = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='24' height='24' viewBox='0 0 24 24'>
        <g fillRule='nonzero' fill='none'>
            <path d='M-6-4h32v32H-6z' />
            <path className='color1-fill' d='M2 2h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2v5a1 1 0 0 1-2 0V1a1 1 0 1 1 2 0v1zm6 2v4h4V4H8zm4 4v4h4V8h-4zm4-4v4h4V4h-4zm0 8v4h4v-4h-4zm-8 0v4h4v-4H8zM4 8v4h4V8H4z' fill='#7F8397' />
        </g>
    </svg>
);

IconFlag.propTypes = {
    className: PropTypes.string,
};

export { IconFlag };
