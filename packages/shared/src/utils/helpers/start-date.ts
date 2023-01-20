import moment from 'moment';
import { toMoment } from '../date';

type TForwardStartingDates = {
    blackouts?: unknown[];
    close?: string;
    date: string;
    open?: string;
};

type TContract = {
    forward_starting_options: TForwardStartingDates[];
};

type TConfig = {
    text: string;
    value: number;
    sessions: {
        open: moment.Moment;
        close: moment.Moment;
    }[];
}[];

export const buildForwardStartingConfig = (contract: TContract, forward_starting_dates: TForwardStartingDates[]) => {
    const forward_starting_config: TConfig = [];

    if ((contract.forward_starting_options || []).length) {
        contract.forward_starting_options.forEach(option => {
            const duplicated_option = forward_starting_config.find(opt => opt.value === parseInt(option.date));
            const current_session = { open: toMoment(option.open), close: toMoment(option.close) };
            if (duplicated_option) {
                duplicated_option.sessions.push(current_session);
            } else {
                forward_starting_config.push({
                    text: toMoment(option.date).format('ddd - DD MMM, YYYY'),
                    value: parseInt(option.date),
                    sessions: [current_session],
                });
            }
        });
    }

    return forward_starting_config.length ? forward_starting_config : forward_starting_dates;
};
