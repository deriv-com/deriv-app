import dayjs from 'dayjs';
import Bowser from 'bowser';
import { LoginHistory } from '@deriv/api-types';

type TData = {
    id: number;
    date: string;
    action: string;
    browser: string;
    ip: string;
    status: string;
}[];

type TUserAgent =
    | (Bowser.Parser.Details & {
          app?: string;
      })
    | undefined;

/** Format API login_history value to a better ones */
export const getLoginHistoryFormattedData = (login_history: LoginHistory) => {
    const data: TData = [];
    const fetch_limit = Math.min(50, login_history.length);
    for (let i = 0; i < fetch_limit; i++) {
        data[i] = {
            date: '',
            action: '',
            browser: '',
            ip: '',
            status: '',
            id: 0,
        };
        const environment = login_history[i].environment;
        const environment_split = environment.split(' ');
        const mobile_app_UA = environment.match(
            /(?<date>[0-9a-zA-Z-]+\s[0-9:]+GMT)[\s](IP=)(?<ip>[\w:.]+)\sIP_COUNTRY=(?<country>([a-zA-Z]{2}))\s(User_AGENT=)(\w.*)(?<name>iPhone|Android)([\W\w]+)\s(?<app>Deriv P2P|Deriv GO)(?<version>[\w\W]+)\s(LANG=)([\w]{2})/
        );
        const date = environment_split[0];
        const time = environment_split[1].replace('GMT', ' GMT');
        data[i].date = `${dayjs(date).format('YYYY-MM-DD')} ${time}`;
        data[i].action = login_history[i].action === 'login' ? 'Login' : 'Logout';
        const user_agent_string = environment.substring(environment.indexOf('User_AGENT'), environment.indexOf('LANG'));
        const user_agent: TUserAgent = mobile_app_UA
            ? mobile_app_UA.groups
            : Bowser.getParser(user_agent_string)?.getBrowser();
        data[i].browser = user_agent ? `${user_agent.name} ${user_agent.app ?? ''} v${user_agent.version}` : 'Unknown';
        data[i].ip = environment_split[2].split('=')[1];
        data[i].status = login_history[i].status === 1 ? 'Successful' : 'Failed';
        data[i].id = i;
    }
    return data;
};

export default getLoginHistoryFormattedData;
