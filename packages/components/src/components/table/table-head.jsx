import React from 'react';

const Head = ({ children }) => {
    return (
        <div role='columnheader' className='dc-table__head'>{children}</div>
    );
};

export default Head;
