import React from 'react';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';

type FlyoutTextProps = {
    text: string;
};

const FlyoutText = (props: FlyoutTextProps) => {
    const { text } = props;

    return (
        <Text as='p' size='xs' styles={{ lineHeight: '1.3em' }}>
            {localize(text)}
        </Text>
    );
};

export default FlyoutText;
