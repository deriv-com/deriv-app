import React from 'react';

const MediaDescription: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => (
    <div className='media__description'>{children}</div>
);

export { MediaDescription };
