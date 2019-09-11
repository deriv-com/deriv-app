import classNames     from 'classnames';
import React          from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';

export const FormSubHeader = ({ title, subtitle }) => (
    <div className='account-management-form-header'>
        <h1 className='account-management-form-header-text'>
            {title}
            {subtitle &&
                <i className='account-management-form-header-subheader'>
                    {subtitle}
                </i>
            }
        </h1>
    </div>
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

export const FormFooter = ({ children }) => (
    <div className='account-management-form-footer'>{children}</div>
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
