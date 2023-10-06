import config from '@currency-config';

export const roundBalance = ({ currency, balance }) => {
    const point = config.lists.CRYPTO_CURRENCIES.includes(currency) ? 8 : 2;
    return Number(balance).toFixed(point);
};

export const getUTCTime = date => {
    const dateObject = new Date(date);
    return `${`0${dateObject.getUTCHours()}`.slice(-2)}:${`0${dateObject.getUTCMinutes()}`.slice(
        -2
    )}:${`0${dateObject.getUTCSeconds()}`.slice(-2)}`;
};
