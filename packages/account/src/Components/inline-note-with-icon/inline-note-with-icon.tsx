import React from 'react';
import { Icon, Text } from '@deriv/components';

type TInlineNoteWithIconExtend = {
    icon?: string;
    font_size?: string;
    message: React.ReactNode;
    title: React.ReactNode;
};

const InlineNoteWithIcon = ({ icon, message, font_size = 'xxxs', title }: TInlineNoteWithIconExtend) => {
    return (
        <div className='da-inline-note-with-icon'>
            {icon && (
                <div>
                    <Icon icon={icon} size={16} />
                </div>
            )}
            <Text as='p' size={font_size} line_height='s'>
                {title && <strong> {title} </strong>}
                {message}
            </Text>
        </div>
    );
};

export default InlineNoteWithIcon;
