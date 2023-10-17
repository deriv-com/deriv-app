import React from 'react';
import { useHistory } from 'react-router-dom';
import { PageErrorContainer } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { TCoreStores } from '@deriv/stores/types';

type TErrorComponentProps = TCoreStores['common']['error'] & {
    setError?: (has_error: boolean, error: React.ReactNode | null) => void;
};

const ErrorComponent = ({
    header,
    message,
    redirect_label,
    redirectOnClick,
    redirect_to = routes.trade,
    setError,
    should_clear_error_on_click,
    should_show_refresh = true,
}: TErrorComponentProps) => {
    const history = useHistory();

    React.useEffect(() => {
        if (!history) return undefined;
        return history.listen(() => {
            if (typeof setError === 'function') {
                setError(false, null);
            }
        });
    }, [history, setError]);

    const refresh_message = should_show_refresh ? (
        <Localize i18n_default_text='Please refresh this page to continue.' />
    ) : (
        ''
    );

    return (
        <PageErrorContainer
            error_header={header ?? ''}
            error_messages={message ? [message, refresh_message] : []}
            redirect_urls={[redirect_to]}
            redirect_labels={[redirect_label || localize('Refresh')]}
            buttonOnClick={redirectOnClick || (() => location.reload())}
            should_clear_error_on_click={should_clear_error_on_click}
            setError={setError}
        />
    );
};

export default ErrorComponent;
