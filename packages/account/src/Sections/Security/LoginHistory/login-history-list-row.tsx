import React from 'react';
import classNames from 'classnames';
import { TLoginHistoryItems } from 'Types';
import { Table } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import LoginHistoryTableTitle from 'Constants/login-history-table-title';
import ListCell from './list-cell';

const LoginHistoryListRow = ({ id, date, action, browser, ip, status }: TLoginHistoryItems) => {
    return (
        <div className={classNames('login-history__list__wrapper')} key={id}>
            <Table.Row className='login-history__list__row login-history__list__row--with-margin'>
                <Table.Cell className='login-history__list__row__cell'>
                    <ListCell title={LoginHistoryTableTitle().date} text={date} />
                </Table.Cell>
            </Table.Row>
            <Table.Row className='login-history__list__row login-history__list__row--with-margin'>
                <Table.Cell className='login-history__list__row__cell'>
                    <ListCell
                        className='login-history__list__row__cell--browser'
                        title={LoginHistoryTableTitle().browser}
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
                        title={LoginHistoryTableTitle().action}
                        text={<Localize i18n_default_text='{{action}}' values={{ action }} />}
                    />
                </Table.Cell>
            </Table.Row>
            <Table.Row className='login-history__list__row'>
                <Table.Cell className='login-history__list__row__cell'>
                    <ListCell
                        className='login-history__list__row__cell--ip-value'
                        title={LoginHistoryTableTitle().ip}
                        text={ip}
                    />
                </Table.Cell>
                {isDesktop() && (
                    <Table.Cell className='login-history__list__row__cell'>
                        <ListCell
                            title={LoginHistoryTableTitle().status}
                            text={<Localize i18n_default_text='{{status}}' values={{ status }} />}
                        />
                    </Table.Cell>
                )}
            </Table.Row>
        </div>
    );
};

export default LoginHistoryListRow;
