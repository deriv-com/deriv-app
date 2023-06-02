export const TRADERS_HUB_URL = `${process.env.APP_URL}appstore/traders-hub`;

export const CONSIDERED_PERFORMANCE_FIELDS = [
    'TaskDuration',
    'TaskOtherDuration',
    'ThreadTime',
    'ProcessTime',
    'JSHeapUsedSize',
    'JSHeapTotalSize',
    'FirstMeaningfulPaint',
    'DomContentLoaded',
    'NavigationStart',
]; // This contains the fields that we base on to determine whether a PR is degrading performance or not
export const RECORDED_PERFORMANCE_FIELDS = [
    'LayoutCount',
    'RecalcStyleCount',
    'RecalcStyleDuration',
    'ScriptDuration',
    'V8CompileDuration',
]; // This contains the fields that we record, but not use to determine whether a PR is degrading performance or not
