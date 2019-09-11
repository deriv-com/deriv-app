import classNames       from 'classnames';
import React            from 'react';
import { Scrollbars }   from 'tt-react-custom-scrollbars';

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

export const FormSubHeader = ({ text }) => (
        <h2 className='account-management-form-header'>{text}</h2>
);

export const TextContainer = ({ children }) => <div className='account-management-text-container'>{children}</div>

export const Text = ({ children, size, color, className }) => (
        <p
                className={classNames('account-management-text', className, {
                'account-management-text--xsmall': size === 'xsmall',
                'account-management-text--small': size === 'small',
                'account-management-text--grey': color === 'grey',
        })}>{children}</p>
);
