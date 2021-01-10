import * as React from 'react';

const Wrapper: React.FC<IWrapper> = ({ children }) => {
    return (
        <div className="dw-wrapper">
            {children}
        </div>
    );
};

type IWrapper = { children: React.ReactNode}

export default Wrapper;
