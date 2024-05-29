import React from 'react';
import { useLocation } from 'react-router-dom';
import { Text } from '@deriv-com/ui';

export const DummyRoute = () => {
    const location = useLocation();
    return (
        <Text align='center' as='p' size='lg'>
            Component for path <span className='font-bold'>{location.pathname}</span>
        </Text>
    );
};
