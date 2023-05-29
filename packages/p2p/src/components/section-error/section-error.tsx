import React from 'react';
import { Text } from '@deriv/components';

type TSectionError = {
    className?: string;
    message: string;
    size?: string;
};

const SectionError = ({ className = 'section-error__form', message, size = 'xxs' }: TSectionError) => (
    <Text as='p' color='loss-danger' size={size} className={className}>
        {message}
    </Text>
);

export default SectionError;
