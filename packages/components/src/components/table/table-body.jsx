import React from 'react';

const Body = ({ children, ...otherProps }) => (
    <div role='rowgroup' {...otherProps}>
        {children}
    </div>
);

export default Body;
