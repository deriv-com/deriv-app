import React from 'react';
import { Text } from '@deriv-com/ui';

const DummyRoute = ({ path }: { path: string }) => (
    <Text align='center' as='p' size='lg'>
        Component for path <span className='font-bold'>{path}</span>
    </Text>
);

export default DummyRoute;
