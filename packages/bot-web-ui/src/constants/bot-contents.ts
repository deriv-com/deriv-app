type TTabsTitleProps = {
    [key: string]: string | number;
};

export const tabs_title: TTabsTitleProps = Object.freeze({
    WORKSPACE: 'Workspace',
    CHART: 'Chart',
});

export const tabs_array: TTabsTitleProps = Object.freeze({
    DASHBOARDTAB: 0,
    BOTBUILDERTAB: 1,
    QUICKSTRATEGYTAB: 2,
    CHARTTAB: 3,
    TUTORIALTAB: 4,
});
