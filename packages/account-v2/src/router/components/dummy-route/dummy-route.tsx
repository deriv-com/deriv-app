import React from 'react';

const DummyRoute = ({ path }: { path: string }) => (
    <div className='text-body-lg'>
        Component for path <span className='font-bold'>{path}</span>
    </div>
);

export default DummyRoute;
