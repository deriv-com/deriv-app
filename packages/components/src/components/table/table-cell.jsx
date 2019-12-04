import React from 'react';

const Cell = ({ children }) => {
    return (
        <div role='cell' className='dc-table__cell'>{children}</div>
    );
};

export default Cell;
