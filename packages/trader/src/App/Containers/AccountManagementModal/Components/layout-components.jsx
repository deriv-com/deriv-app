import React            from 'react';

export const FormFooter = ({ children }) => (
        <div className='account-management-form-footer'>{children}</div>
);
export const FormBody = ({ children }) => (
        <div className='account-management-form-body'>{children}</div>
);
export const FormSubHeader = ({ text }) => (
    <h2 className='account-management-form-header'>{text}</h2>
);
