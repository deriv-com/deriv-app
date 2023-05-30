import React from 'react';

type TToggleContainer = {
    children: React.ReactNode;
};

const ToggleContainer = ({ children }: TToggleContainer) => (
    <div className='toggle-container' data-testid='dt_toggle_container'>
        {children}
    </div>
);

export default ToggleContainer;
