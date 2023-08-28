import React from 'react';
import Bowser from 'bowser';
import classNames from 'classnames';
import moment from 'moment';
import { Loading, Table, Text, ThemedScrollbars } from '@deriv/components';
import { isMobile, isDesktop, PlatformContext, WS } from '@deriv/shared';
import { LoginHistory as TLoginHistory } from '@deriv/api-types';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useFetch } from '@deriv/api';
import LoadErrorMessage from 'Components/load-error-message';

type TListCell = {
    title: string;
    text: string;
    className?: string;
    right?: boolean;
};

type TData = {
    date: string;
    action: string;
    browser: string;
    ip: string;
    status: string;
    id: number;
}[];

type TFields = {
    date: string;
    action: string;
    browser: string;
    ip: string;
    status: string;
};

type TUA =
    | (Bowser.Parser.Details & {
          app?: string;
      })
    | undefined;

const API_FETCH_LIMIT = 50;

const getFormattedData = (login_history: TLoginHistory) => {
    const data: TData = [];
    const fetch_limit = Math.min(API_FETCH_LIMIT, login_history.length);
    const data_object = {
        date: '',
        action: '',
        browser: '',
        ip: '',
        status: '',
        id: 0,
    };

    for (let i = 0; i < fetch_limit; i++) {
        data[i] = data_object;
        const environment = login_history[i].environment;
        const environment_split = environment.split(' ');
        const mobile_app_UA = environment.match(
            /(?<date>[0-9a-zA-Z-]+\s[0-9:]+GMT)[\s](IP=)(?<ip>[\w:.]+)\sIP_COUNTRY=(?<country>([a-zA-Z]{2}))\s(User_AGENT=)(\w.*)(?<name>iPhone|Android)([\W\w]+)\s(?<app>Deriv P2P|Deriv GO)(?<version>[\w\W]+)\s(LANG=)([\w]{2})/
        );
        const date = environment_split[0];
        const time = environment_split[1].replace('GMT', ' GMT');
        data[i].date = `${moment(date).format('YYYY-MM-DD')} ${time}`;
        data[i].action = login_history[i].action === 'login' ? localize('Login') : localize('Logout');
        const user_agent = environment.substring(environment.indexOf('User_AGENT'), environment.indexOf('LANG'));
        const ua: TUA = mobile_app_UA ? mobile_app_UA.groups : Bowser.getParser(user_agent)?.getBrowser();
        data[i].browser = ua ? `${ua.name} ${ua.app ?? ''} v${ua.version}` : localize('Unknown');
        data[i].ip = environment_split[2].split('=')[1];
        data[i].status = login_history[i].status === 1 ? localize('Successful') : localize('Failed');
        data[i].id = i;
    }
    return data;
};

const getFields = () => ({
    date: localize('Date and time'),
    action: localize('Action'),
    browser: localize('Browser'),
    ip: localize('IP address'),
    status: localize('Status'),
});

const LoginHistoryContent = ({ data }: { data: TData }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    if (isMobile()) {
        return renderList(getFields(), data, is_appstore);
    }
    return renderTable(getFields(), data);
};

const renderTable = (fields: TFields, login_history: TData) => (
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

const renderList = (fields: TFields, login_history: TData, is_appstore: boolean) => {
    return (
        <Table className='login-history__list'>
            <Table.Body>
                {login_history.map(item => (
                    <div
                        className={classNames('login-history__list__wrapper', {
                            'login-history__list__wrapper--dashboard': is_appstore,
                        })}
                        key={item.id}
                    >
                        <Table.Row className='login-history__list__row login-history__list__row--with-margin'>
                            <Table.Cell className='login-history__list__row__cell'>
                                <ListCell title={fields.date} text={item.date} />
                            </Table.Cell>
                            {is_appstore && isMobile() && (
                                <Table.Cell className='login-history__list__row__cell'>
                                    <ListCell
                                        className='login-history__list__row__cell--action'
                                        title={fields.action}
                                        text={item.action}
                                        right
                                    />
                                </Table.Cell>
                            )}
                        </Table.Row>
                        <Table.Row className='login-history__list__row login-history__list__row--with-margin'>
                            <Table.Cell className='login-history__list__row__cell'>
                                <ListCell
                                    className='login-history__list__row__cell--browser'
                                    title={fields.browser}
                                    text={item.browser}
                                />
                            </Table.Cell>
                            {is_appstore && isMobile() ? (
                                <Table.Cell className='login-history__list__row__cell'>
                                    <ListCell title={fields.status} text={item.status} right />
                                </Table.Cell>
                            ) : (
                                <Table.Cell className='login-history__list__row__cell'>
                                    <ListCell
                                        className='login-history__list__row__cell--action'
                                        title={fields.action}
                                        text={item.action}
                                    />
                                </Table.Cell>
                            )}
                        </Table.Row>
                        <Table.Row className='login-history__list__row'>
                            <Table.Cell className='login-history__list__row__cell'>
                                <ListCell
                                    className='login-history__list__row__cell--ip-value'
                                    title={fields.ip}
                                    text={item.ip}
                                />
                            </Table.Cell>
                            {!is_appstore ||
                                (isDesktop() && (
                                    <Table.Cell className='login-history__list__row__cell'>
                                        <ListCell title={fields.status} text={item.status} />
                                    </Table.Cell>
                                ))}
                        </Table.Row>
                    </div>
                ))}
            </Table.Body>
        </Table>
    );
};

const ListCell = ({ title, text, className, right }: TListCell) => (
    <React.Fragment>
        <Text as='h3' align={right ? 'right' : 'left'} weight='bold' className='login-history__list__row__cell--title'>
            {title}
        </Text>
        <Text
            className={classNames(className, { 'login-history__list__row__cell--right': right })}
            line_height='xs'
            size='xs'
            align={right ? 'right' : 'left'}
        >
            {text}
        </Text>
    </React.Fragment>
);

const LoginHistory = observer(() => {
    const { client } = useStore();
    const { is_switching } = client;
    const [login_history, setLoginHistory] = React.useState<TData>([]);

    const { data, isError, isLoading, error } = useFetch('login_history', { payload: { limit: API_FETCH_LIMIT } });

    React.useEffect(() => {
        if (!isLoading && !isError && data.login_history) setLoginHistory(getFormattedData(data.login_history));
    }, [data, isLoading, isError]);

    if (is_switching) return <Loading />;
    if (isLoading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (isError) return <LoadErrorMessage error_message={error as string} />;

    return (
        <ThemedScrollbars is_bypassed={isMobile()} className='login-history'>
            {login_history.length ? <LoginHistoryContent data={login_history} /> : null}
        </ThemedScrollbars>
    );
});

export default LoginHistory;
