import React          from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';

export const FormFooter = ({ children }) => (
    <div className='account-management-form-footer'>{children}</div>
);

export const FormBody = ({ children, scroll_offset }) => (
    <Scrollbars
        autoHide
        style={{
            height: scroll_offset ? `calc(100% - ${scroll_offset})` : '100%',
        }}
    >
        <div className='account-management-form-body'>{children}</div>
    </Scrollbars>
);
