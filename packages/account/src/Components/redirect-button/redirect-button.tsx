import { Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import React from 'react';
import { getPlatformRedirect, platforms } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

import { useHistory } from 'react-router';

const RedirectButton = observer(() => {
    const history = useHistory();
    const { common } = useStore();
    const { app_routing_history, routeBackInApp } = common;
    const routeBackTo = (redirect_route: string) => routeBackInApp(history, [redirect_route]);
    const from_platform = getPlatformRedirect(app_routing_history);

    const onClickRedirectButton = () => {
        const platform = platforms[from_platform.ref as keyof typeof platforms];
        const { is_hard_redirect = false, url = '' } = platform ?? {};
        if (is_hard_redirect) {
            window.location.href = url;
            window.sessionStorage.removeItem('config.platform');
        } else {
            routeBackTo(from_platform.route);
        }
    };

    return (
        <Button primary className='proof-of-identity__redirect' onClick={onClickRedirectButton}>
            <Localize i18n_default_text='Back to {{platform_name}}' values={{ platform_name: from_platform.name }} />
        </Button>
    );
});

export default RedirectButton;
