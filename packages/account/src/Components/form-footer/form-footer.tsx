import React from 'react';
import { PlatformContext } from '@deriv/shared';
import classNames from 'classnames';
import { TPlatformContext } from 'Types';

export type TFormFooter = {
    className?: string;
};

const FormFooter = ({ children, className }: React.PropsWithChildren<TFormFooter>) => {
    const { is_appstore }: Partial<TPlatformContext> = React.useContext(PlatformContext);
    return (
        <div
            className={classNames('account-form__footer', className, {
                'account-form__footer--dashboard': is_appstore,
            })}
            data-testid='form-footer-container'
        >
            {children}
        </div>
    );
};

export default FormFooter;
