/**
 * A utility function which return date string after converting and formatting date objects/strings.
 * @param date the date object or string which needs to be converted/formatted.
 * @param format (optional) the format of the returned date. Default format is  'YYYY-MM-DD' (ISO 8601).
 */
export const getFormattedDateString = (date: Date | string, format = 'YYYY-MM-DD') => {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {};

    switch (format) {
        case 'YYYY-MM-DD':
            options.year = 'numeric';
            options.month = '2-digit';
            options.day = '2-digit';
            break;
        case 'DD MMM YYYY':
            options.day = '2-digit';
            options.month = 'short';
            options.year = 'numeric';
            break;
        default:
            options.year = 'numeric';
            options.month = '2-digit';
            options.day = '2-digit';
            break;
    }

    const formattedDate = dateObj.toLocaleDateString('en-GB', options).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
    return formattedDate;
};

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
