import React from 'react';

type TBody = {
    className?: string;
};

const Body = ({ children, ...otherProps }: React.PropsWithChildren<TBody>) => (
    <div role='rowgroup' {...otherProps}>
        {children}
    </div>
);

export default Body;
