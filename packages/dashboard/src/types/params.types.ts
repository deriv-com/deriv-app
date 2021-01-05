export type TRoute = {
    component?: React.ReactNode;
    exact?: boolean;
    getTitle: () => string;
    is_authenticated?: boolean;
    path?: string;
};
