import React from 'react';
import { Text } from '@deriv-com/ui';

export const DummyRoute = ({ path }: { path: string }) => (
    <Text align='center' as='p' size='lg'>
        Component for path <span className='font-bold'>{path}</span>
    </Text>
);
