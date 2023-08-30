import React from 'react';
import classNames from 'classnames';
import { Loading, Table, Text, ThemedScrollbars } from '@deriv/components';
import { isMobile, isDesktop } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { TData } from '@deriv/api/types';
import { useLoginHistory } from '@deriv/api';
import LoadErrorMessage from 'Components/load-error-message';

type TListCell = {
    title: JSX.Element | string;
    text: JSX.Element | string;
    className?: string;
    is_align_right?: boolean;
};

type TGetFields = {
    date: JSX.Element;
    action: JSX.Element;
    browser: JSX.Element;
    ip: JSX.Element;
    status: JSX.Element;
};

const getFields = () => ({
    date: <Localize i18n_default_text='Date and time' />,
    action: <Localize i18n_default_text='Action' />,
    browser: <Localize i18n_default_text='Browser' />,
    ip: <Localize i18n_default_text='IP address' />,
    status: <Localize i18n_default_text='Status' />,
});

const LoginHistoryContent = ({ data }: { data: TData }) => {
    if (isMobile()) {
        return renderList(getFields(), data);
    }
    return renderTable(getFields(), data);
};

const renderTable = (fields: TGetFields, login_history: TData) => (
    <Table fixed className='login-history__table'>
        <Table.Header>
            <Table.Row className='login-history__table__header'>
                <Table.Head>{fields.date}</Table.Head>
                <Table.Head>{fields.action}</Table.Head>
                <Table.Head>{fields.browser}</Table.Head>
                <Table.Head>{fields.ip}</Table.Head>
                <Table.Head>{fields.status}</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {login_history.map(item => (
                <Table.Row className='login-history__table__row' key={item.id}>
                    <Table.Cell>
                        <Text line_height='xs' size='xs'>
                            {item.date}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='login-history__table__row__cell login-history__table__row__cell--action'>
                        {item.action}
                    </Table.Cell>
                    <Table.Cell>{item.browser}</Table.Cell>
                    <Table.Cell>{item.ip}</Table.Cell>
                    <Table.Cell>{item.status}</Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
);

const renderList = (fields: TGetFields, login_history: TData) => {
    return (
        <Table className='login-history__list'>
            <Table.Body>
                {login_history.map(item => (
                    <div className={classNames('login-history__list__wrapper')} key={item.id}>
                        <Table.Row className='login-history__list__row login-history__list__row--with-margin'>
                            <Table.Cell className='login-history__list__row__cell'>
                                <ListCell title={fields.date} text={item.date} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className='login-history__list__row login-history__list__row--with-margin'>
                            <Table.Cell className='login-history__list__row__cell'>
                                <ListCell
                                    className='login-history__list__row__cell--browser'
                                    title={fields.browser}
                                    text={item.browser}
                                />
                            </Table.Cell>
                            <Table.Cell className='login-history__list__row__cell'>
                                <ListCell
                                    className='login-history__list__row__cell--action'
                                    title={fields.action}
                                    text={item.action}
                                />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className='login-history__list__row'>
                            <Table.Cell className='login-history__list__row__cell'>
                                <ListCell
                                    className='login-history__list__row__cell--ip-value'
                                    title={fields.ip}
                                    text={item.ip}
                                />
                            </Table.Cell>
                            {isDesktop() && (
                                <Table.Cell className='login-history__list__row__cell'>
                                    <ListCell title={fields.status} text={item.status} />
                                </Table.Cell>
                            )}
                        </Table.Row>
                    </div>
                ))}
            </Table.Body>
        </Table>
    );
};

const ListCell = ({ title, text, className, is_align_right }: TListCell) => (
    <React.Fragment>
        <Text
            as='h3'
            align={is_align_right ? 'right' : 'left'}
            weight='bold'
            className='login-history__list__row__cell--title'
        >
            {title}
        </Text>
        <Text
            className={classNames(className, { 'login-history__list__row__cell--right': is_align_right })}
            line_height='xs'
            size='xs'
            align={is_align_right ? 'right' : 'left'}
        >
            {text}
        </Text>
    </React.Fragment>
);

const LoginHistory = observer(() => {
    const { client } = useStore();
    const { is_switching, is_authorize } = client;

    const { login_history, isError, isLoading, error } = useLoginHistory(is_authorize);

    if (is_switching) return <Loading />;
    if (isLoading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (isError) return <LoadErrorMessage error_message={error as string} />;

    return (
        <ThemedScrollbars is_bypassed={isMobile()} className='login-history'>
            {login_history.length && <LoginHistoryContent data={login_history} />}
        </ThemedScrollbars>
    );
});

export default LoginHistory;
