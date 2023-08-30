import React from 'react';
import moment from 'moment';
import Bowser from 'bowser';
import { LoginHistory as TLoginHistory } from '@deriv/api-types';
import { Localize } from '../../../translations/src/i18next/i18next';
import { TData } from '../../types';
import useFetch from '../useFetch';

const API_FETCH_LIMIT = 50;

type TUserAgent =
    | (Bowser.Parser.Details & {
          app?: string;
      })
    | undefined;

const getFormattedData = (login_history: TLoginHistory) => {
    const data: TData = [];
    const fetch_limit = Math.min(API_FETCH_LIMIT, login_history.length);
    const data_object = {
        date: '',
        action: <></>,
        browser: '',
        ip: '',
        status: <></>,
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
        data[i].action =
            login_history[i].action === 'login' ? (
                <Localize i18n_default_text='Login' />
            ) : (
                <Localize i18n_default_text='Logout' />
            );
        const user_agent_string = environment.substring(environment.indexOf('User_AGENT'), environment.indexOf('LANG'));
        const user_agent: TUserAgent = mobile_app_UA
            ? mobile_app_UA.groups
            : Bowser.getParser(user_agent_string)?.getBrowser();
        data[i].browser = user_agent ? (
            `${user_agent.name} ${user_agent.app ?? ''} v${user_agent.version}`
        ) : (
            <Localize i18n_default_text='Unknown' />
        );
        data[i].ip = environment_split[2].split('=')[1];
        data[i].status =
            login_history[i].status === 1 ? (
                <Localize i18n_default_text='Successful' />
            ) : (
                <Localize i18n_default_text='Failed' />
            );
        data[i].id = i;
    }
    return data;
};

const useLoginHistory = (is_authorize: boolean) => {
    const [login_history, setLoginHistory] = React.useState<TData>([]);

    const { data, isError, isLoading, error } = useFetch('login_history', {
        payload: { limit: API_FETCH_LIMIT },
        options: { enabled: is_authorize },
    });

    React.useEffect(() => {
        if (!isLoading && !isError && data.login_history) setLoginHistory(getFormattedData(data.login_history));
    }, [data, isLoading, isError]);

    return { login_history, isError, isLoading, error };
};

export default useLoginHistory;
