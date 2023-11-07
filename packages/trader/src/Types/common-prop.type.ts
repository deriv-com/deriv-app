import { TCoreStores } from '@deriv/stores/types';
import { useTraderStore } from 'Stores/useTraderStores';
import { Redirect, RouteComponentProps } from 'react-router-dom';

export type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
    passthrough?: {
        root_store: TCoreStores;
        WS: unknown;
    };
};

export type TTextValueStrings = {
    text: string;
    value: string;
};

export type TTextValueNumber = {
    text: string;
    value: number;
};

export type TProposalTypeInfo = TTradeStore['proposal_info'][string];

export type TError = {
    error?: {
        code?: string;
        details?: {
            field?: string;
        };
        message?: string;
    };
};

type TRoute = {
    component?: React.ComponentType<RouteComponentProps> | React.ComponentType<Record<string, never>> | typeof Redirect;
    default?: boolean;
    exact?: boolean;
    getTitle?: () => string;
    path?: string;
    to?: string;
};

export type TRouteConfig = TRoute & {
    is_authenticated?: boolean;
    routes?: TRoute[];
};

export type TTradeStore = ReturnType<typeof useTraderStore>;
