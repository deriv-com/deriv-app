import React from 'react';
import { Switch } from 'react-router-dom';
import { Localize } from '@deriv/translations';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes';

type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

const Loading = () => {
    return (
        <div>
            <Localize i18n_default_text='Loading...' />
        </div>
    );
};

const BinaryRoutes = (props: TBinaryRoutesProps) => {
    return (
        <React.Suspense fallback={<Loading />}>
            <Switch>
                {getRoutesConfig().map((route, idx: number) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
