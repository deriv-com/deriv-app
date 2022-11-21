type TTabsTitleProps = {
    [key: string]: string | number;
};

export const tabs_title: TTabsTitleProps = Object.freeze({
    WORKSPACE: 'Workspace',
    CHART: 'Chart',
});

export const tabs_array: TTabsTitleProps = Object.freeze({
    DASHBOARD_TAB: 0,
    BOT_BUILDER_TAB: 1,
    QUICK_STRATEGY_TAB: 2,
    CHART_TAB: 3,
    TUTORIAL_TAB: 4,
});
