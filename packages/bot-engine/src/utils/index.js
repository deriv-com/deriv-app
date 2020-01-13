import {
    isEnded,
    getFinalPrice,
    getIndicativePrice,
    getContractTypeName,
}                            from './contract';
import { gtm }               from './gtm';
import {
    createError ,
    trackAndEmitError,
}                            from './error';
import { observer }          from './observer';
import { importExternal }    from './html-helper';
import { onWorkspaceResize } from './workspace';

export default {
    createError,
    trackAndEmitError,
    isEnded,
    importExternal,
    getFinalPrice,
    getIndicativePrice,
    getContractTypeName,
    gtm,
    observer,
    onWorkspaceResize,
};
