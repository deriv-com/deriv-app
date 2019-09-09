import React          from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';

export const FormFooter = ({ children }) => (
    <div className='account-management-form-footer'>{children}</div>
);

export const FormBody = ({ children }) => (
    <Scrollbars
        autoHide
        style={{
            height: 'calc(100% + 4em)',
        }}
    >
        <div className='account-management-form-body'>{children}</div>
    </Scrollbars>
);
