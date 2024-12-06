import { withRouter } from 'react-router-dom';

import { ButtonLink } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Callback } from '@deriv-com/auth-client';

const CallbackPage = () => {
    return (
        <Callback
            onSignInSuccess={tokens => {
                localStorage.setItem('config.tokens', JSON.stringify(tokens));
                localStorage.setItem('config.account1', tokens.token1);
                localStorage.setItem('active_loginid', tokens.acct1);

                window.location.href = routes.traders_hub;
            }}
            renderReturnButton={() => {
                return (
                    <ButtonLink to={routes.traders_hub}>
                        <p>{"Return to Trader's Hub"}</p>
                    </ButtonLink>
                );
            }}
        />
    );
};

export default withRouter(CallbackPage);
