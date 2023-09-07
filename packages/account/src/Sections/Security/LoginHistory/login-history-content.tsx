import React from 'react';
import { Localize } from '@deriv/translations';
import { Table } from '@deriv/components';
import { TData } from '@deriv/api/src/hooks/useLoginHistory';
import { fields } from '../../../../../utils/src/getLoginHistoryFormattedData';
import LoginHistoryTableRow from './login-history-table-row';
import LoginHistoryListRow from './login-history-list-row';

type TGetFields = {
    [key: string]: JSX.Element;
};

type TLoginHistoryContent = {
    data: TData;
    is_mobile: boolean;
};

const getFields = () =>
    Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [
            key,
            <Localize i18n_default_text='{{value}}' values={{ value }} key={key} />,
        ])
    );

const LoginHistoryContent = ({ data, is_mobile }: TLoginHistoryContent) => {
    if (is_mobile) {
        return renderList(data);
    }
    return renderTable(getFields(), data);
};

const renderTable = (fields: TGetFields, login_history: TData) => (
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

const renderList = (login_history: TData) => {
    return (
        <Table className='login-history__list'>
            <Table.Body>
                {login_history.map(item => {
                    return <LoginHistoryListRow key={item.id} {...item} />;
                })}
            </Table.Body>
        </Table>
    );
};

export default LoginHistoryContent;
