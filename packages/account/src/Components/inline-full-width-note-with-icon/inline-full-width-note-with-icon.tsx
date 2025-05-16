import React from 'react';
import { Icon, Text } from '@deriv/components';

type TInlineFullWidthNoteWithIconExtend = {
    icon?: string;
    font_size?: string;
    icon_size?: number;
    message: React.ReactNode;
    title?: React.ReactNode;
};

const InlineFullWidthNoteWithIcon = ({
    icon,
    message,
    font_size = 'xxxs',
    icon_size = 24,
    title,
}: TInlineFullWidthNoteWithIconExtend) => {
    return (
        <div className='da-inline-full-width-note-with-icon'>
            {icon && (
                <div>
                    <Icon icon={icon} size={icon_size} />
                </div>
            )}
            <Text as='p' size={font_size} line_height='s'>
                {title && <strong> {title} </strong>}
                {message}
            </Text>
        </div>
    );
};

export default InlineFullWidthNoteWithIcon;
