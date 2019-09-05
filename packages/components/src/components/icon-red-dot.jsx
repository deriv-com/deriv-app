import PropTypes from 'prop-types';
import React     from 'react';

// TODO remove this file entirely when icon component is ready.
const IconRedDot = ({ className }) => (
    <svg className={className} width='4' height='4'>
        <circle cx='1163' cy='626' r='2' transform='translate(-1161 -624)' fill='#E31C4B' fillRule='nonzero' />
    </svg>
);

IconRedDot.propTypes = {
    className: PropTypes.string,
};

export default IconRedDot;
