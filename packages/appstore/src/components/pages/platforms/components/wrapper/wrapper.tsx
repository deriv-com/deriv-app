import * as React from 'react';
import { TReactChildren } from 'Types';

const Wrapper: React.FC<TWrapper> = ({ children }) => {
    return <div className='dw-wrapper'>{children}</div>;
};

type TWrapper = {
    children: TReactChildren;
};

export default Wrapper;
