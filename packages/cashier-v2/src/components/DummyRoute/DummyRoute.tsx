import React from 'react';
import { Text } from '@deriv-com/ui';
import { TRouteComponent } from '../../constants/routesConfig';

const DummyRoute = ({ title }: TRouteComponent) => {
    return <Text size='lg'>Welcome to {title}</Text>;
};

export default DummyRoute;
