export type TBrowserName = 'chromium' | 'firefox' | 'webkit';

export type TConsideredResults = {
    TaskDuration: number;
    TaskOtherDuration: number;
    ThreadTime: number;
    ProcessTime: number;
    JSHeapUsedSize: number;
    JSHeapTotalSize: number;
    FirstMeaningfulPaint: number;
    DomContentLoaded: number;
    NavigationStart: number;
};
export type TUnconsideredResults = {
    LayoutCount: number;
    RecalcStyleCount: number;
    RecalcStyleDuration: number;
    ScriptDuration: number;
    V8CompileDuration: number;
};
export type TPerformanceResults = {
    considered_results: Partial<TConsideredResults>;
    unconsidered_results: Partial<TUnconsideredResults>;
};
