import React from 'react';
import './toggle-container.scss';

type ToggleContainerProps = {
    children: React.ReactNode
};

const ToggleContainer = (
    {
        children
    }: ToggleContainerProps
) => <div className='p2p-toggle-container'>{children}</div>;

export default ToggleContainer;
