import React from 'react';
import { Table } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import { TLoginHistoryItems } from './login-history-table-row';
import classNames from 'classnames';
import ListCell from './list-cell';

const fields = {
    date: 'Date and time',
    action: 'Action',
    browser: 'Browser',
    ip: 'IP address',
    status: 'Status',
};

const LoginHistoryListRow = (props: TLoginHistoryItems) => {
    const { id, date, action, browser, ip, status } = props;
    return (
        <div className={classNames('login-history__list__wrapper')} key={id}>
            <Table.Row className='login-history__list__row login-history__list__row--with-margin'>
                <Table.Cell className='login-history__list__row__cell'>
                    <ListCell title={fields.date} text={date} />
                </Table.Cell>
            </Table.Row>
            <Table.Row className='login-history__list__row login-history__list__row--with-margin'>
                <Table.Cell className='login-history__list__row__cell'>
                    <ListCell
                        className='login-history__list__row__cell--browser'
                        title={fields.browser}
                        text={
                            browser === 'Unknown' ? (
                                <Localize i18n_default_text='{{browser}}' values={{ browser }} />
                            ) : (
                                browser
                            )
                        }
                    />
                </Table.Cell>
                <Table.Cell className='login-history__list__row__cell'>
                    <ListCell
                        className='login-history__list__row__cell--action'
                        title={fields.action}
                        text={<Localize i18n_default_text='{{action}}' values={{ action }} />}
                    />
                </Table.Cell>
            </Table.Row>
            <Table.Row className='login-history__list__row'>
                <Table.Cell className='login-history__list__row__cell'>
                    <ListCell className='login-history__list__row__cell--ip-value' title={fields.ip} text={ip} />
                </Table.Cell>
                {isDesktop() && (
                    <Table.Cell className='login-history__list__row__cell'>
                        <ListCell
                            title={fields.status}
                            text={<Localize i18n_default_text='{{status}}' values={{ status }} />}
                        />
                    </Table.Cell>
                )}
            </Table.Row>
        </div>
    );
};

export default LoginHistoryListRow;
