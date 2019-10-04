import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconDBot = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='32' height='32' viewBox='0 0 32 32'>
        <g fill='none' fillRule='evenodd'>
            <rect width='32' height='32' fill='#FF6444' fillRule='nonzero' rx='6' />
            <path d='M13.72 13.26a.845.845 0 1 0 0-1.69.845.845 0 0 0 0 1.69z' />
            <path fill='#FFF' fillRule='nonzero' d='M25.26 15.43v-4.6A4.84 4.84 0 0 0 20.43 6h-3.86v9.43h8.69zM16.57 26h3.86a4.84 4.84 0 0 0 4.83-4.83v-4.6h-8.69V26zM11.795 13.9a2.825 2.825 0 1 1 2.77-3.36h.865V6h-3.86a4.84 4.84 0 0 0-4.83 4.83v10.34A4.84 4.84 0 0 0 11.57 26h3.86V11.605h-.865a2.825 2.825 0 0 1-2.77 2.295z' />
            <path d='M0 0h32v32H0z' />
        </g>
    </svg>
);

IconDBot.propTypes = {
    className: PropTypes.string,
};

export default IconDBot;
