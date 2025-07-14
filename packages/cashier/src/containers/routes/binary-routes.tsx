import React from 'react';
import { Switch } from 'react-router-dom';

import { Loading } from '@deriv/components';

import getRoutesConfig from 'Constants/routes-config';

import RouteWithSubRoutes from './route-with-sub-routes';

type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

const BinaryRoutes = (props: TBinaryRoutesProps) => {
    return (
        <React.Suspense fallback={<Loading className='cashier__loader' is_fullscreen={false} />}>
            <Switch>
                {getRoutesConfig().map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
