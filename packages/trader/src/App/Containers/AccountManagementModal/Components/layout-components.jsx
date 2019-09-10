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

export const Table = ({ children, className }) => (
        <table className={classNames('account-management-table', className)}>
                {children}
        </table>
);

export const TableHead = ({ children, className }) => <thead classNames={className}>{children}</thead>

export const TableHeader = ({ children, is_flex }) =>
        <th
            className={classNames('account-management-form-header', {
                'account-management-flex-wrapper': is_flex,
        })}>{children}</th>

export const TableBody = ({ children }) => <tbody>{children}</tbody>

export const Row = ({ children }) => (
        <tr style={{ display: 'flex', justifyContent: 'space-between' }}>
            {children}
        </tr>
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

export const Td = ({ children, is_flex }) => (
        <td
                className={classNames('account-management-text', {
                'account-management-flex-wrapper': is_flex,
        })}>{children}</td>
);
