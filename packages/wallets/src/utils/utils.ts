import moment from 'moment';

export default function unixToDateString(date: Date, format = 'YYYY-MM-DD') {
    const formattedDate = moment(date).format(format);

    return formattedDate;
}

type TServerError = {
    code: string;
    details?: { [key: string]: string };
    fields?: string[];
    message: string;
};

export const isServerError = (error: unknown): error is TServerError =>
    typeof error === 'object' && error !== null && 'code' in error;

export const defineViewportHeight = () => {
    const viewportHeight = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--wallets-vh', `${viewportHeight}px`);
};
