import React from 'react';
import PropTypes from 'prop-types';

export const TableLayout = React.forwardRef(({ children }, ref) => (
    <div style={{ margin: '0 24px', }} ref={ref}>
        {children}
    </div>
));

TableLayout.displayName = 'TableLayout';

TableLayout.propTypes = {
    children: PropTypes.node,
};
