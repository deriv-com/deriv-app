import React from 'react';

export const TextContainer = ({ children }) => (
    <div className='account__text_container' data-testid='dt_text_container'>
        {children}
    </div>
);
