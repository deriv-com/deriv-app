import React from 'react';
import { CaptionText } from '@deriv-com/quill-ui';

type TAccountGroupWrapper = { separator_text?: React.ReactNode };

const AccountGroupWrapper = ({ children, separator_text }: React.PropsWithChildren<TAccountGroupWrapper>) => {
    return separator_text ? (
        <div className='acc-switcher-dtrader__accounts-list__group'>
            <CaptionText
                color='quill-typography__color--default'
                className='acc-switcher-dtrader__accounts-list__title'
                bold
            >
                {separator_text}
            </CaptionText>
            {children}
        </div>
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );
};

export default AccountGroupWrapper;
