import React from 'react';
import classNames from 'classnames';

export type TFormFooter = {
    className?: string;
};

const FormFooter = ({ children, className }: React.PropsWithChildren<TFormFooter>) => (
    <div className={classNames('account-form__footer', className)} data-testid='form-footer-container'>
        {children}
    </div>
);

export default FormFooter;
