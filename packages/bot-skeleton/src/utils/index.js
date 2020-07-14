import { getContractTypeName } from './contract';
import { createError, trackAndEmitError } from './error';
import { observer } from './observer';
import { importExternal } from './html-helper';
import { onWorkspaceResize } from './workspace';
import { getSavedWorkspaces, saveWorkspaceToRecent, removeExistingWorkspace } from './local-storage';
import { timeSince } from './date-time-helper';

export default {
    createError,
    trackAndEmitError,
    importExternal,
    getContractTypeName,
    observer,
    onWorkspaceResize,
    getSavedWorkspaces,
    removeExistingWorkspace,
    saveWorkspaceToRecent,
    timeSince,
};
