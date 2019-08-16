import PropTypes  from 'prop-types';
import React      from 'react';

const IconClear = ({ className, onClick }) => (
    <svg
        className={className || undefined}
        onClick={onClick}
       
        width='16'
        height='16'
        viewBox='0 0 12 12'
    >
        <path d='M6 0a6 6 0 1 0 0 12A6 6 0 1 0 6 0zm2.406 7.815a.422.422 0 0 1-.598.596L6 6.598 4.192 8.41a.419.419 0 0 1-.597 0 .422.422 0 0 1 0-.596L5.404 6l-1.81-1.815a.422.422 0 0 1 .597-.596L6 5.402l1.808-1.814a.422.422 0 0 1 .598.596L6.596 6l1.81 1.815z' fill='#B0B3BF' fillRule='evenodd' />
    </svg>
);

IconClear.propTypes = {
    className: PropTypes.string,
    onClick  : PropTypes.func,
};

export default IconClear;
