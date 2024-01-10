import React from 'react';
import { CaptionText, Text } from '@deriv/quill-design';

type TDynamicLeverageTableColumnHeader = {
    subtitle: string;
    title: string;
};

export const DynamicLeverageTableColumnHeader = ({ subtitle, title }: TDynamicLeverageTableColumnHeader) => (
    <div className='flex flex-col'>
        <Text align='center' bold size='sm'>
            {title}
        </Text>
        <CaptionText align='center'>{subtitle}</CaptionText>
    </div>
);
