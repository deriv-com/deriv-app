import * as React from 'react';
import { TReactChildren } from 'Types'

const Wrapper: React.FC<TWrapperProps> = ({ children }) => {
    return <div className='dw-wrapper'>{children}</div>;
};

type TWrapperProps = {
    children: TReactChildren;
}

export default Wrapper;
