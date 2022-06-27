import { getOhlc, checkDirection, getOhlcFromEnd, getLastTick, getTicks, getLastDigitList } from '../trade/Ticks';
import getLastDigit from 'binary-utils/lib/number/getLastDigit';

const getTicksInterface = () => {
    return {
        getLastTick: (...args) => getLastTick(...args),
        getLastDigit: (...args) => getLastDigit(...args),
        getTicks: (...args) => getTicks(...args),
        checkDirection: (...args) => checkDirection(...args),
        getOhlcFromEnd: (...args) => getOhlcFromEnd(...args),
        getOhlc: (...args) => getOhlc(...args),
        getLastDigitList: (...args) => getLastDigitList(...args),
    };
};

export default getTicksInterface;
