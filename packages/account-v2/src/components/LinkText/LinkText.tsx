import React, { ComponentProps } from 'react';
import { Text } from '@deriv-com/ui';

export const LinkText = ({ children, ...rest }: ComponentProps<typeof Text>) => (
    <Text as='a' color='red' rel='noreferrer' size='sm' target='_blank' {...rest}>
        {children}
    </Text>
);
