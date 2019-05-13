import PropTypes      from 'prop-types';
import React          from 'react';

const BottomWidgets = ({
    Digits,
}) => (
    <div className='bottom-widgets'>
        {Digits}
    </div>
);

BottomWidgets.propTypes = {
    Digits: PropTypes.node,
};

export default BottomWidgets;
