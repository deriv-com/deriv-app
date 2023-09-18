import React from 'react';

const ToggleContainer = ({ children }: React.PropsWithChildren<unknown>) => (
    <div className='toggle-container' data-testid='dt_toggle_container'>
        {children}
    </div>
);

export default ToggleContainer;
