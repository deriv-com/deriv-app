import React              from 'react';
import {
    IconBarrier,
    IconId,
    IconDuration,
    IconTarget,
    IconStartTime,
    IconEntrySpot,
    IconExitSpot }  from 'deriv-components';

export const getThemedIcon = (type) => {
    let IconType;
    if (type) {
        switch (type) {
            case 'id':
                IconType = <IconId />;
                break;
            case 'duration':
                IconType = <IconDuration />;
                break;
            case 'barrier':
                IconType = <IconBarrier />;
                break;
            case 'target':
                IconType = <IconTarget />;
                break;
            case 'start_time':
                IconType = <IconStartTime />;
                break;
            case 'entry_spot':
                IconType = <IconEntrySpot />;
                break;
            case 'exit_spot':
                IconType = <IconExitSpot />;
                break;
            default:
                break;
        }
    }
    if (!IconType) return null;
    return IconType;
};
