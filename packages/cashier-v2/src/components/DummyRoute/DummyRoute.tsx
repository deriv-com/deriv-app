import React from 'react';
import { Text } from '@deriv-com/ui';
import { TRouteTypes } from '../../types';

const DummyRoute = ({ title }: TRouteTypes.TRouteComponent) => {
    return <Text size='lg'>Welcome to {title}</Text>;
};

export default DummyRoute;
