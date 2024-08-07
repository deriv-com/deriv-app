import React from 'react';
import classNames from 'classnames';
import { CaptionText } from '@deriv-com/quill-ui';

type TAccountGroupWrapper = { separator_text?: React.ReactNode; show_bottom_separator?: boolean };

const AccountGroupWrapper = ({
    children,
    separator_text,
    show_bottom_separator,
}: React.PropsWithChildren<TAccountGroupWrapper>) =>
    separator_text ? (
        <div
            className={classNames('acc-switcher-dtrader__accounts-list__group', {
                'acc-switcher-dtrader__accounts-list__group--separator': show_bottom_separator,
            })}
        >
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

export default AccountGroupWrapper;
