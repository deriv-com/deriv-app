import * as React from 'react';

const Wrapper: React.FC<IWrapperProps> = ({ children }) => {
    return <div className='dw-wrapper'>{children}</div>;
};

interface IWrapperProps {
    children: React.ReactNode;
}

export default Wrapper;
