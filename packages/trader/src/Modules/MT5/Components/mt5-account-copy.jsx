import React from 'react';
import { Clipboard } from '@deriv/components';
import { localize } from '@deriv/translations';

const Mt5AccountCopy = ({ text, className }) => {
    return (
        <div className={className}>
            <Clipboard text_copy={text} info_message={localize('copy')} success_message={localize('copied!')} />
        </div>
    );
};

export { Mt5AccountCopy };
