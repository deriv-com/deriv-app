import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconCashier = ({ className }) => (
    <svg className={classNames('inline-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <rect stroke='#2A3052' x='.5' y='5.5' width='15' height='9' rx='1' />
            <path fill='#2A3052' d='M0 11h16v1H0z' />
            <path stroke='#2A3052' d='M2.5 3.5h4v2h-4z' />
            <rect stroke='#2A3052' x='9.5' y='1.5' width='6' height='2' rx='1' />
            <path fill='#2A3052' d='M12 4h1v1h-1z' />
            <rect fill='#2A3052' x='10' y='9' width='4' height='1' rx='.5' />
            <rect fill='#2A3052' x='10' y='7' width='4' height='1' rx='.5' />
            <rect fill='#2A3052' x='8' y='9' width='1' height='1' rx='.5' />
            <rect fill='#2A3052' x='8' y='7' width='1' height='1' rx='.5' />
            <rect fill='#2A3052' x='6' y='9' width='1' height='1' rx='.5' />
            <rect fill='#2A3052' x='6' y='7' width='1' height='1' rx='.5' />
            <rect fill='#2A3052' x='4' y='9' width='1' height='1' rx='.5' />
            <rect fill='#2A3052' x='4' y='7' width='1' height='1' rx='.5' />
            <rect fill='#2A3052' x='2' y='9' width='1' height='1' rx='.5' />
            <rect fill='#2A3052' x='2' y='7' width='1' height='1' rx='.5' />
        </g>
    </svg>
);

IconCashier.propTypes = {
    className: PropTypes.string,
};

export { IconCashier };
