import React from 'react';

const MediaHeading: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => (
    <div className='media__heading'>{children}</div>
);

export { MediaHeading };
