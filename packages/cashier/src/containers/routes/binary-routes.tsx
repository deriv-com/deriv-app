import React from 'react';
import { Switch } from 'react-router-dom';
import { useIsHubRedirectionEnabled } from '@deriv/hooks';
import { platforms } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Loading } from '@deriv/components';
import Page404 from 'Components/page-404';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes';

type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

const BinaryRoutes = (props: TBinaryRoutesProps) => {
    const { client } = useStore();
    const { has_wallet, loginid } = client;
    const { isHubRedirectionEnabled } = useIsHubRedirectionEnabled();

    const is_wallet_login = /^((CRW|MFW|VRW)\d+)/.test(loginid ?? '');

    if (has_wallet && is_wallet_login && isHubRedirectionEnabled) {
        window.location.replace(`${platforms.tradershub_os.url}/wallets`);
        return null;
    }

    if (has_wallet) return <Page404 />;

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
