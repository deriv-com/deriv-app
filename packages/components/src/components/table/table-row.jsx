import React from 'react';

const Row = ({ children, ...props }) => {
    return (
        <div role='row' className='dc-table__row' {...props}>{children}</div>
    );
};

export default Row;
