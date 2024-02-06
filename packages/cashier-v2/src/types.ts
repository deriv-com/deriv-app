import { cashierPathRoutes } from './routes/Router';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TRouteTypes {
    export type TRoutes = typeof cashierPathRoutes[keyof typeof cashierPathRoutes];
    export interface IRouteConfig {
        component: React.ComponentType<Omit<IRouteConfig, 'component'>>;
        path: string;
        routes?: IRouteConfig[];
        title: string;
    }
    export type TRouteComponent = React.ComponentProps<IRouteConfig['component']>;
}

declare module 'react-router-dom' {
    export function useHistory(): { push: (path: TRouteTypes.TRoutes) => void };

    export function useRouteMatch(path: TRouteTypes.TRoutes): boolean;
}
