import React from 'react';
import { Loading, Table, ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { TData } from '@deriv/api/src/hooks/useLoginHistory';
import { useLoginHistory } from '@deriv/api';
import LoadErrorMessage from 'Components/load-error-message';
import LoginHistoryTableRow from './login-history-table-row';
import LoginHistoryListRow from './login-history-list-row';

export type TGetFields = {
    [key: string]: JSX.Element;
};

type TLoginHistoryContent = {
    data: TData;
    is_mobile: boolean;
};

const fields = {
    date: 'Date and time',
    action: 'Action',
    browser: 'Browser',
    ip: 'IP address',
    status: 'Status',
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

const LoginHistory = observer(() => {
    const {
        client,
        ui: { is_mobile },
    } = useStore();
    const { is_switching } = client;

    const { data, isError, isLoading, error } = useLoginHistory();

    const login_history = data?.formatted_data;

    if (is_switching) return <Loading />;
    if (isLoading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (isError) return <LoadErrorMessage error_message={error as string} />;

    return (
        <ThemedScrollbars is_bypassed={is_mobile} className='login-history'>
            {login_history.length && <LoginHistoryContent data={login_history} is_mobile={is_mobile} />}
        </ThemedScrollbars>
    );
});

export default LoginHistory;
