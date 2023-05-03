import React from 'react';

const MediaItem = (props: { children: React.ReactNode | string }) => <div className='media'>{props.children}</div>;

export default MediaItem;
