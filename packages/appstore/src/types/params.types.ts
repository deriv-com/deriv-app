export type TRoute = {
    component?: () => React.ReactNode;
    default?: boolean;
    exact?: boolean;
    getTitle?: () => string;
    icon?: string;
    is_authenticated?: boolean;
    is_routed?: boolean;
    is_modal?: boolean;
    label?: string;
    path?: string;
    routes?: TRoute[];
    subroutes?: TRoute[];
};

export type TRouteGroup = {
    default?: boolean;
    icon?: string;
    getTitle?: () => string;
    path?: string;
    subitems?: number[];
};

export type TAccountCategory = 'real' | 'demo';
export type TAccountType = 'synthetic' | 'financial' | 'financial_stp';

export type TCurrenciesList = {
    [x: string]: {
        text: string;
        value: string;
        has_tooltip: boolean;
    };
};

export type TUpgradeInfo =
    | undefined
    | {
          type: TAccountType;
          can_upgrade: boolean;
          can_upgrade_to: string;
          can_open_multi: boolean;
      };
