import React from 'react';

const MediaDescription = (props: { children: React.ReactNode | string }) => (
    <div className='media__description'>{props.children}</div>
);

export { MediaDescription };
