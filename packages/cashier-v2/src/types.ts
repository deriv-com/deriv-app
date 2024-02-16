import { cashierPathRoutes } from './routes/Router';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TRouteTypes {
    export type TRoutes = typeof cashierPathRoutes[keyof typeof cashierPathRoutes];
    export interface IRouteConfig {
        component: React.ComponentType<
            Omit<IRouteConfig, 'component'> & { setSideNotes?: React.Dispatch<React.SetStateAction<TSideNotes>> }
        >;
        path: string;
        routes?: IRouteConfig[];
        title: string;
    }
    export type TRouteComponent = React.ComponentProps<IRouteConfig['component']>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TErrorTypes {
    export type TServerError = {
        code: string;
        details?: { [key: string]: string };
        fields?: string[];
        message: string;
    };
}

export type TSideNotes = {
    notes: JSX.Element[] | [];
    position?: 'bottom' | 'top';
};

declare module 'react-router-dom' {
    export function useHistory(): {
        location: {
            hash: string;
            pathname: TRouteTypes.TRoutes;
            search: string;
            state: Record<string, unknown>;
        };
        push: (path: TRouteTypes.TRoutes) => void;
    };

    export function useRouteMatch(path: TRouteTypes.TRoutes): boolean;
}
