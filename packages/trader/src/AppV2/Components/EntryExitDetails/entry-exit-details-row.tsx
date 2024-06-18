import React from 'react';
import { Text, CaptionText } from '@deriv-com/quill-ui';

const EntryExitDetailRow = ({
    label,
    value,
    date,
    time,
    is_time = false,
}: {
    label: React.ReactNode;
    value?: string;
    date?: string;
    time: string;
    is_time?: boolean;
}) => (
    <div className='entry-exit-details__table-row'>
        <div className='entry-exit-details__table-cell'>
            <Text size='sm' color='quill-typography__color--subtle'>
                {label}
            </Text>
        </div>
        <div className='entry-exit-details__table-cell'>
            <Text size='sm'>{is_time ? date : value}</Text>
            {!is_time && (
                <Text size='sm' color='quill-typography__color--subtle'>
                    {date}
                </Text>
            )}
            <CaptionText color='quill-typography__color--subtle'>{time}</CaptionText>
        </div>
    </div>
);

export default EntryExitDetailRow;
