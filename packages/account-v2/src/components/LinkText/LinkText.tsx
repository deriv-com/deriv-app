import React, { ComponentProps } from 'react';
import { Text } from '@deriv-com/ui';

export const LinkText = ({ children, ...rest }: ComponentProps<typeof Text>) => (
    <Text as='a' color='red' rel='noreferrer' target='_blank' {...rest} size='sm'>
        {children}
    </Text>
);
