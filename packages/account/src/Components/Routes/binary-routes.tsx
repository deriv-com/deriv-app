import React from 'react';
import { Switch } from 'react-router-dom';
import { PlatformContext } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes';
import { TPlatformContext } from 'Types';

type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

const BinaryRoutes = (props: TBinaryRoutesProps) => {
    const { is_appstore } = React.useContext<TPlatformContext>(PlatformContext);

    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {getRoutesConfig({ is_appstore }).map((route, idx: number) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
