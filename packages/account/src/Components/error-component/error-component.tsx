import { PageError } from '@deriv/components';
import { Localize } from '@deriv-com/translations';
import { routes } from '@deriv/shared';
import { requestOidcAuthentication } from '@deriv-com/auth-client';
import Cookies from 'js-cookie';

type TErrorComponent = {
    header: JSX.Element | string;
    message: JSX.Element | string;
    code: string;
    redirect_label: string;
    redirectOnClick: (() => void) | null;
    should_show_refresh: boolean;
};

const is_deriv_com = /deriv\.(com)/.test(window.location.hostname);

const ErrorComponent = ({
    header,
    message,
    code,
    redirect_label,
    redirectOnClick,
    should_show_refresh = true,
}: Partial<TErrorComponent>) => {
    const refresh_message: JSX.Element | string = should_show_refresh ? (
        <Localize i18n_default_text='Please refresh this page to continue.' />
    ) : (
        ''
    );

    if (code === 'InvalidToken' && Cookies.get('logged_state') === 'true' && is_deriv_com) {
        try {
            requestOidcAuthentication({
                redirectCallbackUri: `${window.location.origin}/callback`,
            }).catch((err: string) => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }

        return null;
    }

    return (
        <PageError
            header={header || <Localize i18n_default_text='Oops, something went wrong.' />}
            messages={
                message
                    ? [message, refresh_message]
                    : [
                          <Localize
                              i18n_default_text='Sorry, an error occurred while processing your request.'
                              key={0}
                          />,
                          refresh_message,
                      ]
            }
            redirect_urls={[routes.trade]}
            redirect_labels={[redirect_label ?? <Localize i18n_default_text='Refresh' />]}
            buttonOnClick={redirectOnClick ?? (() => location.reload())}
        />
    );
};

export default ErrorComponent;
