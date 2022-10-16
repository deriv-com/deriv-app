import React from 'react';
import { Clipboard } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { TCFDAccountCopy } from './props.types';

const CFDAccountCopy = ({ text, className }: TCFDAccountCopy) => {
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

export { CFDAccountCopy };
