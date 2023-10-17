import React from 'react';
import { useStore } from '@deriv/stores';

type TScrollbarWrapper = {
    children: JSX.Element;
    height?: string;
};

const ScrollbarWrapper = ({ children, height }: TScrollbarWrapper) => {
    const {
        ui: { is_mobile },
    } = useStore();

    return (
        <div className='scrollbar-wrapper' style={{ height: is_mobile ? '100%' : height }}>
            {children}
        </div>
    );
};

export default ScrollbarWrapper;
