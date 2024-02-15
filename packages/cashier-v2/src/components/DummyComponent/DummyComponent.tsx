import React from 'react';
import { Text } from '@deriv-com/ui';
import { TRouteTypes } from '../../types';

const DummyComponent: React.FC<TRouteTypes.TRouteComponent> = ({ title }) => {
    return <Text size='lg'>{title} page does not exist</Text>;
};

export default DummyComponent;
