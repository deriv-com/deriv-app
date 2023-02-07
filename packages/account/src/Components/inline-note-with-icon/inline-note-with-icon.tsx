import React from 'react';
import { Icon, Text } from '@deriv/components';

type TInlineNoteWithIconExtend = {
    icon: string;
    message: React.ReactNode;
    title: string;
};

const InlineNoteWithIcon = ({ icon, message, title }: TInlineNoteWithIconExtend) => {
    return (
        <div className='da-inline-note-with-icon'>
            <div>
                <Icon icon={icon} size={16} />
            </div>
            <Text as='p' size='xxxs' line_height='s'>
                <strong>{title}: </strong>
                {message}
            </Text>
        </div>
    );
};

export default InlineNoteWithIcon;
