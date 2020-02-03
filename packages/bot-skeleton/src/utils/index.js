import { isEnded, getFinalPrice, getIndicativePrice, getContractTypeName } from './contract';
import { createError, trackAndEmitError } from './error';
import { observer } from './observer';
import { importExternal } from './html-helper';
import { onWorkspaceResize } from './workspace';
import { getSavedWorkspaces, saveWorkspaceToRecent } from './local-storage';
import { timeSince } from './date-time-helper';

export default {
    createError,
    trackAndEmitError,
    isEnded,
    importExternal,
    getFinalPrice,
    getIndicativePrice,
    getContractTypeName,
    observer,
    onWorkspaceResize,
    getSavedWorkspaces,
    saveWorkspaceToRecent,
    timeSince,
};
