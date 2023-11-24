import React from 'react';
import { Clipboard } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';

type TCopyTextIcon = {
    text: string | undefined;
    className: string;
};

const CopyTextIcon = ({ text, className }: TCopyTextIcon) => {
    return (
        <div className={className} data-testid='copy_text_icon_main_div'>
            <Clipboard
                text_copy={text}
                info_message={isMobile() ? '' : localize('copy')}
                success_message={localize('copied!')}
                popoverAlignment={isMobile() ? 'left' : 'bottom'}
            />
        </div>
    );
};

export { CopyTextIcon };
