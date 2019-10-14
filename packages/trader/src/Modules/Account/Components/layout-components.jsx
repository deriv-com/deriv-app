import classNames           from 'classnames';
import React                from 'react';
import { ThemedScrollbars } from 'deriv-components';

export const FormSubHeader = ({ title, subtitle }) => (
    <div className='account-form__header'>
        <h1 className='account-form__title'>
            {title}
            {subtitle &&
                <i className='account-form__subtitle'>
                    {subtitle}
                </i>
            }
        </h1>
    </div>
);

export const FormBody = ({ children, scroll_offset }) => (
    <ScrollbarsContainer
        className='account__scrollbars_container--grid-layout'
        scroll_offset={scroll_offset}
    >
        {children}
    </ScrollbarsContainer>
);

export const FormFooter = ({ children }) => (
    <div className='account-form__footer'>{children}</div>
);

export const TextContainer = ({ children }) => (
    <div className='account__text_container'>{children}</div>
);

export const Text = ({ children, size, color, className }) => (
    <p
        className={classNames('account__text', className, {
            'account__text--xsmall': size === 'xsmall',
            'account__text--small' : size === 'small',
            'account__text--grey'  : color === 'grey',
        })}
    >
        {children}
    </p>
);

export const ScrollbarsContainer = ({ children, className, scroll_offset }) => (
    <ThemedScrollbars
        autoHide
        style={{
            height: scroll_offset ? `calc(100% - ${scroll_offset})` : '100%',
        }}
    >
        <div className={classNames('account__scrollbars_container', className)}>{children}</div>
    </ThemedScrollbars>
);
