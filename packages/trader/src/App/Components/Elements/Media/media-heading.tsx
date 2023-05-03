import React from 'react';

const MediaHeading = (props: { children: React.ReactNode | string }) => (
    <div className='media__heading'>{props.children}</div>
);

export { MediaHeading };
