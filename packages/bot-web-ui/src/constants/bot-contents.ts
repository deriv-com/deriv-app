type TTabsTitleProps = {
    [key: string]: string | number;
};

export const tabs_title: TTabsTitleProps = Object.freeze({
    WORKSPACE: 'Workspace',
    CHART: 'Chart',
});

export const DASHBOARD_TABS: TTabsTitleProps = Object.freeze({
    DASHBOARD: 0,
    BOT_BUILDER: 1,
    QUICK_STRATEGY: 2,
    CHART: 3,
    TUTORIAL: 4,
});

export const MAX_STRATEGIES = 10;
