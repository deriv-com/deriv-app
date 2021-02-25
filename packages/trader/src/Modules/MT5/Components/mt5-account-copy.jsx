import React from 'react';
import { Clipboard } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';

const Mt5AccountCopy = ({ text, className }) => {
    return (
        <div className={className}>
            <Clipboard
                text_copy={text}
                info_message={isMobile() ? '' : localize('copy')}
                success_message={localize('copied!')}
                popoverAlignment={isMobile() ? 'left' : 'bottom'}
            />
        </div>
    );
};

export { Mt5AccountCopy };
