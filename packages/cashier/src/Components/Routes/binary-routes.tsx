import React from 'react';
import { Switch } from 'react-router-dom';
import { Localize } from '@deriv/shared';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.tsx';

type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

const BinaryRoutes = (props: TBinaryRoutesProps) => {
    // george removed is_appstore (per conversation with Bala, we are handling appstore in a separate git branch)
    // const { is_appstore } = React.useContext(PlatformContext);

    return (
        // george return ReactNode instead of () => ReactNode
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {getRoutesConfig().map((route, idx: number) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
