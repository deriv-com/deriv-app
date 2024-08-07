import React from 'react';
import { Switch } from 'react-router-dom';
import { useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import Page404 from 'Components/page-404';
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
    const { client } = useStore();
    const { has_wallet } = client;

    if (has_wallet) return <Page404 />;

    return (
        <React.Suspense fallback={<Loading />}>
            <Switch>
                {getRoutesConfig().map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
