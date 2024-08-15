import React from 'react';
import { Text, CaptionText } from '@deriv-com/quill-ui';

const EntryExitDetailRow = ({
    label,
    value,
    date,
    time,
}: {
    label: React.ReactNode;
    value?: string;
    date?: string;
    time: string;
}) => (
    <div className='entry-exit-details__table-row'>
        <div className='entry-exit-details__table-cell'>
            <Text size='sm' color='quill-typography__color--subtle'>
                {label}
            </Text>
        </div>
        <div className='entry-exit-details__table-cell'>
            <Text size='sm'>{value}</Text>
            <Text size='sm' color='quill-typography__color--subtle'>
                {date}
            </Text>
            <CaptionText color='quill-typography__color--subtle'>{time}</CaptionText>
        </div>
    </div>
);

export default EntryExitDetailRow;
