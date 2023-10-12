import React from 'react';
import { Text } from '@deriv/components';

const FlyoutText = (props: { text: string }) => {
    const { text } = props;

    return (
        <Text as='p' size='xs' styles={{ lineHeight: '1.3em' }}>
            {text}
        </Text>
    );
};

export default FlyoutText;
