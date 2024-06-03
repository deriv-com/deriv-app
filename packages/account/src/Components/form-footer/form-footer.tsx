import React from 'react';
import clsx from 'clsx';

export type TFormFooter = {
    className?: string;
};

const FormFooter = ({ children, className }: React.PropsWithChildren<TFormFooter>) => (
    <div className={clsx('account-form__footer', className)} data-testid='form-footer-container'>
        {children}
    </div>
);

export default FormFooter;
