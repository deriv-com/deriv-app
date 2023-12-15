import React from 'react';
import { Clipboard } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';

type TCopyTextComponent = {
    text: string | undefined;
    className: string;
};

const CopyTextComponent = ({ text, className }: TCopyTextComponent) => {
    return (
        <div className={className} data-testid='cfd_account_copy_main_div'>
            <Clipboard
                text_copy={text}
                info_message={isMobile() ? '' : localize('copy')}
                success_message={localize('copied!')}
                popoverAlignment={isMobile() ? 'left' : 'bottom'}
            />
        </div>
    );
};

export { CopyTextComponent };
