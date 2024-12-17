import { useHistory, withRouter } from 'react-router-dom';

import { Button } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Callback } from '@deriv-com/auth-client';

const CallbackPage = () => {
    const history = useHistory();
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
                    <Button
                        onClick={() => {
                            history.push('/');
                            window.location.reload();
                        }}
                        secondary
                        is_circular
                    >
                        <Localize i18n_default_text='Try again' />
                    </Button>
                );
            }}
        />
    );
};

export default withRouter(CallbackPage);
