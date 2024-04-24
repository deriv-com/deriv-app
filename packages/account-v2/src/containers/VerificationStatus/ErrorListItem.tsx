import React from 'react';
import { Text } from '@deriv-com/ui';

type TErrorListItemProps = {
    index?: number;
    text: string;
};

export const ErrorListItem = ({ index, text }: TErrorListItemProps) => (
    <div>
        {index && <Text size='xs'>{index}</Text>}
        <Text size='xs'>{text}</Text>
    </div>
);
