import React from 'react';
import { Localize } from '@deriv/translations';
import { Table } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { TLoginHistoryData } from '@deriv/api/types';
import LoginHistoryTableTitle from 'Constants/login-history-table-title';
import LoginHistoryTableRow from './login-history-table-row';
import LoginHistoryListRow from './login-history-list-row';

type TGetFields = {
    [key: string]: JSX.Element;
};

type TLoginHistoryContent = {
    data: TLoginHistoryData;
};

const LoginHistoryContent = ({ data }: TLoginHistoryContent) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    return is_mobile ? renderList(data) : renderTable(LoginHistoryTableTitle(), data);
};

const renderTable = (fields: TGetFields, login_history: TLoginHistoryData) => (
    <Table fixed className='login-history__table'>
        <Table.Header>
            <Table.Row className='login-history__table__header'>
                {Object.values(fields).map((field, index) => (
                    <Table.Head key={index}>{field}</Table.Head>
                ))}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {login_history.map(item => (
                <LoginHistoryTableRow key={item.id} {...item} />
            ))}
        </Table.Body>
    </Table>
);

const renderList = (login_history: TLoginHistoryData) => (
    <Table className='login-history__list'>
        <Table.Body>
            {login_history.map(item => (
                <LoginHistoryListRow key={item.id} {...item} />
            ))}
        </Table.Body>
    </Table>
);

export default LoginHistoryContent;
