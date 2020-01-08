import {
    isEnded,
    getFinalPrice,
    getIndicativePrice,
    getContractTypeName,
}                        from './contract';
import gtm               from './gtm';
import {
    createError ,
    trackAndEmitError,
}                        from './error';
import { observer }      from './observer';

export default {
    createError,
    trackAndEmitError,
    isEnded,
    getFinalPrice,
    getIndicativePrice,
    getContractTypeName,
    gtm,
    observer,
};
